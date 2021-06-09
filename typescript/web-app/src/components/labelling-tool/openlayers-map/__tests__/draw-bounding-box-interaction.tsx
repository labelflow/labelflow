/* eslint-disable import/first */
// @ts-ignore Needs to be done before ol is imported
global.URL.createObjectURL = jest.fn(() => "mockedUrl");

import { ApolloProvider } from "@apollo/client";
import { Map } from "@labelflow/react-openlayers-fiber";
import { render } from "@testing-library/react";
import gql from "graphql-tag";
import { Feature, Map as OlMap } from "ol";
import { fromExtent } from "ol/geom/Polygon";
import { DrawEvent, DrawEventType } from "ol/interaction/Draw";
import { useRouter } from "next/router";
import { client } from "../../../../connectors/apollo-client";
import { DrawBoundingBoxInteraction } from "../draw-bounding-box-interaction";
import {
  useLabellingStore,
  Tools,
} from "../../../../connectors/labelling-state";
import { setupTestsWithLocalDatabase } from "../../../../utils/setup-local-db-tests";

setupTestsWithLocalDatabase();

/**
 * Mock the apollo client to avoid creating corrupted files that allows
 * us to identify a behaviour.
 */
jest.mock("../../../../connectors/apollo-client", () => {
  const original = jest.requireActual("../../../../connectors/apollo-client");

  return {
    client: { ...original.client, mutate: jest.fn(original.client.mutate) },
  };
});

jest.mock("next/router");

const createImage = async (name: String) => {
  const mutationResult = await client.mutate({
    mutation: gql`
      mutation createImage($file: Upload!, $name: String!) {
        createImage(data: { name: $name, file: $file }) {
          id
        }
      }
    `,
    variables: {
      file: new Blob(),
      name,
    },
  });

  const {
    data: {
      createImage: { id },
    },
  } = mutationResult;

  return id;
};

it("create a label when the user has finished to draw a bounding box on the labelling interface", async () => {
  const mapRef: { current: OlMap | null } = { current: null };
  const id = await createImage("myImage");
  useLabellingStore.setState({ selectedTool: Tools.BOUNDING_BOX });
  (client.mutate as jest.Mock).mockReset();
  (client.mutate as jest.Mock).mockImplementationOnce(jest.fn());
  (useRouter as jest.Mock).mockImplementation(() => ({
    query: { id },
  }));

  render(<DrawBoundingBoxInteraction />, {
    wrapper: ({ children }) => (
      <Map
        args={{ interactions: [] }}
        ref={(map) => {
          mapRef.current = map;
        }}
      >
        <ApolloProvider client={client}>{children}</ApolloProvider>
      </Map>
    ),
  });

  const drawInteraction = mapRef.current?.getInteractions().getArray()?.[0];

  drawInteraction?.dispatchEvent(
    new DrawEvent(
      "drawend" as DrawEventType,
      new Feature(fromExtent([100, 200, 200, 300]))
    )
  );

  expect(client.mutate).toHaveBeenCalledWith(
    expect.objectContaining({
      variables: { imageId: id, x: 100, y: 200, width: 100, height: 100 },
    })
  );
});
