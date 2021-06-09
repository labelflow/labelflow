/* eslint-disable import/first */
// @ts-ignore Needs to be done before ol is imported
global.URL.createObjectURL = jest.fn(() => "mockedUrl");

import { ApolloProvider } from "@apollo/client";
import { Map } from "@labelflow/react-openlayers-fiber";
import { render } from "@testing-library/react";
import { Feature, Map as OlMap } from "ol";
import { fromExtent } from "ol/geom/Polygon";
import { DrawEvent, DrawEventType } from "ol/interaction/Draw";

import { client } from "../../../../connectors/apollo-client";
import { useUndoStore } from "../../../../connectors/undo-store";
import {
  useLabellingStore,
  Tools,
} from "../../../../connectors/labelling-state";
import { setupTestsWithLocalDatabase } from "../../../../utils/setup-local-db-tests";

import { DrawBoundingBoxInteraction } from "../draw-bounding-box-interaction";

setupTestsWithLocalDatabase();

jest.mock("../../../../connectors/apollo-client", () => {
  const original = jest.requireActual("../../../../connectors/apollo-client");
  return {
    client: {
      ...original.client,
      mutate: jest.fn(() => ({
        data: { createLabel: { id: "mocked-label-id" } },
      })),
    },
  };
});

jest.mock("next/router", () => ({
  useRouter: () => ({
    query: { id: "mocked-image-id" },
  }),
}));

beforeEach(() => {
  (client.mutate as jest.Mock).mockClear();
  useLabellingStore.setState({ selectedTool: Tools.BOUNDING_BOX });
});

it("create a label when the user has finished to draw a bounding box on the labelling interface", async () => {
  const mapRef: { current: OlMap | null } = { current: null };
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
      variables: {
        imageId: "mocked-image-id",
        x: 100,
        y: 200,
        width: 100,
        height: 100,
      },
    })
  );
});

it("is possible to undo the creation of the label", async () => {
  const mapRef: { current: OlMap | null } = { current: null };
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

  await useUndoStore.getState().undo();

  expect(client.mutate).toHaveBeenLastCalledWith(
    expect.objectContaining({
      variables: { id: "mocked-label-id" },
    })
  );
});
