/* eslint-disable import/order */
/* eslint-disable import/first */
// @ts-ignore Needs to be done before ol is imported
global.URL.createObjectURL = jest.fn(() => "mockedUrl");

import { ApolloProvider } from "@apollo/client";
import { Map } from "@labelflow/react-openlayers-fiber";
import { render, waitFor } from "@testing-library/react";

import { Map as OlMap } from "ol";
import { Geometry } from "ol/geom";
import VectorLayer from "ol/layer/Vector";
import { mockNextRouter } from "../../../../utils/router-mocks";

mockNextRouter();

import { useRouter } from "next/router";
import { client } from "../../../../connectors/apollo-client/schema-client";
import { Labels } from "../labels";
import { useLabelingStore } from "../../../../connectors/labeling-state";
import { setupTestsWithLocalDatabase } from "../../../../utils/setup-local-db-tests";
import { processImage } from "../../../../connectors/repository/image-processing";
import VectorSource from "ol/source/Vector";
import {
  CREATE_TEST_DATASET_MUTATION,
  CREATE_TEST_IMAGE_MUTATION,
} from "../../../../utils/tests/mutations";
import { CREATE_LABEL_MUTATION } from "../../../../connectors/undo-store/effects/shared-queries";
import { LabelCreateInput } from "../../../../graphql-types/globalTypes";

setupTestsWithLocalDatabase();

jest.mock("../../../../connectors/repository/image-processing");
const mockedProcessImage = processImage as jest.Mock;

const imageWidth = 500;
const imageHeight = 900;

const testDatasetId = "test dataset id";

const createDataset = async (
  name: string,
  datasetId: string = testDatasetId
) => {
  return await client.mutate({
    mutation: CREATE_TEST_DATASET_MUTATION,
    variables: {
      name,
      datasetId,
      workspaceSlug: "local",
    },
    fetchPolicy: "no-cache",
  });
};

const createImage = async (name: String) => {
  mockedProcessImage.mockReturnValue({
    width: 42,
    height: 36,
    mime: "image/jpeg",
  });
  const mutationResult = await client.mutate({
    mutation: CREATE_TEST_IMAGE_MUTATION,
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

const createLabel = async (data: Omit<LabelCreateInput, "geometry">) => {
  const mutationResult = await client.mutate({
    mutation: CREATE_LABEL_MUTATION,
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
  await createLabel({ imageId });
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
      (
        mapRef.current?.getLayers().getArray()[0] as VectorLayer<
          VectorSource<Geometry>
        >
      )
        .getSource()
        .getFeatures()
    ).toHaveLength(1);
  });
});

it("displays created labels", async () => {
  const mapRef: { current: OlMap | null } = { current: null };
  await createLabel({ imageId });
  await createLabel({ imageId });
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
      (
        mapRef.current?.getLayers().getArray()[0] as VectorLayer<
          VectorSource<Geometry>
        >
      )
        .getSource()
        .getFeatures()
    ).toHaveLength(2);
  });
});

it("should change style of selected label", async () => {
  const mapRef: { current: OlMap | null } = { current: null };
  const labelId = await createLabel({ imageId });
  useLabelingStore.setState({ selectedLabelId: labelId });
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
    const [feature] = (
      mapRef.current?.getLayers().getArray()[0] as VectorLayer<
        VectorSource<Geometry>
      >
    )
      .getSource()
      .getFeatures();
    /* When the label is selected it contains two styles, one for the label, another for the vertices style */
    expect(feature.getStyle()).toHaveLength(2);
  });
});
