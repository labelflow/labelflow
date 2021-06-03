/* eslint-disable import/first */
import "fake-indexeddb/auto";

// @ts-ignore Needs to be done before ol is imported
global.URL.createObjectURL = jest.fn(() => "mockedUrl");

import { ApolloProvider } from "@apollo/client";
import { Map } from "@labelflow/react-openlayers-fiber";
import { render } from "@testing-library/react";
import gql from "graphql-tag";
import { Feature, Map as OlMap } from "ol";
import { fromExtent } from "ol/geom/Polygon";
import { DrawEvent, DrawEventType } from "ol/interaction/Draw";
import { client } from "../../../../connectors/apollo-client";
import { db } from "../../../../connectors/database";
import { DrawBoundingBoxInteraction } from "../draw-bounding-box-interaction";
import { clearGetUrlFromImageIdMem } from "../../../../connectors/apollo-client/resolvers/image";
import {
  useLabellingStore,
  Tools,
} from "../../../../connectors/labelling-state";

/**
 * We bypass the structured clone algorithm as its current js implementation
 * as its current js implementation doesn't support blobs.
 * It might make our tests a bit different from what would actually happen
 * in a browser.
 */
jest.mock("fake-indexeddb/build/lib/structuredClone", () => ({
  default: (i: any) => i,
}));
// @ts-ignore
global.Image = class Image extends HTMLElement {
  width: number;

  height: number;

  constructor() {
    super();
    this.width = 42;
    this.height = 36;
    setTimeout(() => {
      this?.onload?.(new Event("onload")); // simulate success
    }, 100);
  }
};
// @ts-ignore
customElements.define("image-custom", global.Image);

beforeAll(() => {});

beforeEach(async () => {
  // Warning! The order matters for those 2 lines.
  // Otherwise, there is a failing race condition.
  await Promise.all(db.tables.map((table) => table.clear()));
  clearGetUrlFromImageIdMem();
});

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

it("create a label in the db on the end of a draw interaction", async () => {
  const mapRef: { current: OlMap | null } = { current: null };
  const id = await createImage("myImage");
  useLabellingStore.setState({ selectedTool: Tools.BOUNDING_BOX });
  (client.mutate as jest.Mock).mockReset();
  (client.mutate as jest.Mock).mockImplementationOnce(jest.fn());
  render(<DrawBoundingBoxInteraction imageId={id} />, {
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
