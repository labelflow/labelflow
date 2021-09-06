/* eslint-disable import/order */
/* eslint-disable import/first */
// @ts-ignore Needs to be done before ol is imported
global.URL.createObjectURL = jest.fn(() => "mockedUrl");

import { ApolloProvider, gql } from "@apollo/client";
import { Map } from "@labelflow/react-openlayers-fiber";
import { render, waitFor } from "@testing-library/react";

import { Map as OlMap } from "ol";
import VectorLayer from "ol/layer/Vector";
import { mockNextRouter } from "../../../../utils/router-mocks";

mockNextRouter();

import { useRouter } from "next/router";
import { client } from "../../../../connectors/apollo-client/schema-client";
import { Labels } from "../labels";
import { LabelCreateInput } from "@labelflow/graphql-types";
import { useLabellingStore } from "../../../../connectors/labelling-state";
import { setupTestsWithLocalDatabase } from "../../../../utils/setup-local-db-tests";
import { probeImage } from "@labelflow/common-resolvers/src/utils/probe-image";

setupTestsWithLocalDatabase();

jest.mock("@labelflow/common-resolvers/src/utils/probe-image");
const mockedProbeSync = probeImage as jest.Mock;

const imageWidth = 500;
const imageHeight = 900;

const testDatasetId = "test dataset id";

const createDataset = async (
  name: string,
  datasetId: string = testDatasetId
) => {
  return await client.mutate({
    mutation: gql`
      mutation createDataset($datasetId: String, $name: String!) {
        createDataset(data: { id: $datasetId, name: $name }) {
          id
          name
        }
      }
    `,
    variables: {
      name,
      datasetId,
    },
    fetchPolicy: "no-cache",
  });
};

const createImage = async (name: String) => {
  mockedProbeSync.mockReturnValue({
    width: 42,
    height: 36,
    mime: "image/jpeg",
  });
  const mutationResult = await client.mutate({
    mutation: gql`
      mutation createImage(
        $file: Upload!
        $name: String!
        $width: Int
        $height: Int
        $datasetId: ID!
      ) {
        createImage(
          data: {
            name: $name
            file: $file
            width: $width
            height: $height
            datasetId: $datasetId
          }
        ) {
          id
        }
      }
    `,
    variables: {
      file: new Blob(),
      name,
      width: imageWidth,
      height: imageHeight,
      datasetId: testDatasetId,
    },
  });

  const {
    data: {
      createImage: { id },
    },
  } = mutationResult;

  return id;
};

const createLabel = async (data: Partial<LabelCreateInput>) => {
  const mutationResult = await client.mutate({
    mutation: gql`
      mutation createLabel($data: LabelCreateInput!) {
        createLabel(data: $data) {
          id
        }
      }
    `,
    variables: {
      data: {
        ...data,
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [0, 0],
              [1, 0],
              [1, 1],
              [0, 1],
              [0, 0],
            ],
          ],
        },
      },
    },
  });

  const {
    data: {
      createLabel: { id },
    },
  } = mutationResult;

  return id;
};

let imageId: string;

beforeEach(async () => {
  await createDataset("Test dataset");
  imageId = await createImage("myImage");

  (useRouter as jest.Mock).mockImplementation(() => ({
    query: { imageId, datasetId: testDatasetId },
  }));
});

it("displays a single label", async () => {
  const mapRef: { current: OlMap | null } = { current: null };

  await createLabel({
    imageId,
  });

  render(<Labels />, {
    wrapper: ({ children }) => (
      <Map
        ref={(map) => {
          mapRef.current = map;
        }}
      >
        <ApolloProvider client={client}>{children}</ApolloProvider>
      </Map>
    ),
  });

  await waitFor(() => {
    expect(
      (mapRef.current?.getLayers().getArray()[0] as VectorLayer)
        .getSource()
        .getFeatures()
    ).toHaveLength(1);
  });
});

it("displays created labels", async () => {
  const mapRef: { current: OlMap | null } = { current: null };
  await createLabel({
    imageId,
  });

  await createLabel({
    imageId,
  });

  render(<Labels />, {
    wrapper: ({ children }) => (
      <Map
        ref={(map) => {
          mapRef.current = map;
        }}
      >
        <ApolloProvider client={client}>{children}</ApolloProvider>
      </Map>
    ),
  });

  await waitFor(() => {
    expect(
      (mapRef.current?.getLayers().getArray()[0] as VectorLayer)
        .getSource()
        .getFeatures()
    ).toHaveLength(2);
  });
});

it("should change style of selected label", async () => {
  const mapRef: { current: OlMap | null } = { current: null };
  const labelId = await createLabel({
    imageId,
  });

  useLabellingStore.setState({ selectedLabelId: labelId });

  render(<Labels />, {
    wrapper: ({ children }) => (
      <Map
        ref={(map) => {
          mapRef.current = map;
        }}
      >
        <ApolloProvider client={client}>{children}</ApolloProvider>
      </Map>
    ),
  });

  await waitFor(() => {
    const [feature] = (mapRef.current?.getLayers().getArray()[0] as VectorLayer)
      .getSource()
      .getFeatures();

    /* When the label is selected it contains two styles, one for the label, another for the vertices style */
    expect(feature.getStyle()).toHaveLength(2);
  });
});
