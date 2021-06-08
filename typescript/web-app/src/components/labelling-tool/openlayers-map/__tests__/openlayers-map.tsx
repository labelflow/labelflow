/* eslint-disable import/first */
// @ts-ignore Needs to be done before ol is imported
global.URL.createObjectURL = jest.fn(() => "mockedUrl");

import { createRef } from "react";
import { ApolloProvider } from "@apollo/client";
import { render, waitFor } from "@testing-library/react";
import useMeasure from "react-use-measure";
import gql from "graphql-tag";
import { Map as OlMap } from "ol";
import VectorLayer from "ol/layer/Vector";
import { client } from "../../../../connectors/apollo-client";
import { OpenlayersMap } from "../openlayers-map";
import { LabelCreateInput } from "../../../../graphql-types.generated";
import { setupTestsWithLocalDatabase } from "../../../../utils/setup-local-db-tests";
import {
  useLabellingStore,
  Tools,
} from "../../../../connectors/labelling-state";

setupTestsWithLocalDatabase();

jest.mock("react-use-measure");

// @ts-ignore
useMeasure.mockImplementation(() => [null, { width: 1000, height: 1000 }]);

const createImage = async (name: String) => {
  const mutationResult = await client.mutate({
    mutation: gql`
      mutation createImage($file: Upload!, $name: String!) {
        createImage(data: { name: $name, file: $file }) {
          id
          height
          width
          url
        }
      }
    `,
    variables: {
      file: new Blob(),
      name,
    },
  });

  const {
    data: { createImage: image },
  } = mutationResult;

  return image;
};

const createLabel = async (data: LabelCreateInput) => {
  const mutationResult = await client.mutate({
    mutation: gql`
      mutation createLabel($data: LabelCreateInput!) {
        createLabel(data: $data) {
          id
        }
      }
    `,
    variables: {
      data,
    },
  });

  const {
    data: { createLabel: label },
  } = mutationResult;

  return label;
};

test("should select label when user clicks on it", async () => {
  const mapRef = createRef<OlMap>();
  const image = await createImage("myImage");
  const label = await createLabel({
    x: 0,
    y: 0,
    height: 1000,
    width: 1000,
    imageId: image.id,
  });
  useLabellingStore.setState({ selectedTool: Tools.SELECTION });

  render(<OpenlayersMap ref={mapRef} image={image} />, {
    wrapper: ({ children }) => (
      <ApolloProvider client={client}>{children}</ApolloProvider>
    ),
  });

  await waitFor(() => {
    // @ts-ignore
    const features = (mapRef.current?.getLayers().getArray()[1] as VectorLayer)
      .getSource()
      .getFeatures();
    expect(features).toHaveLength(1);

    // TODO: Figure out why openlayers map does not find the feature
    jest
      // @ts-ignore
      .spyOn(mapRef.current, "getFeaturesAtPixel")
      // @ts-ignore
      .mockImplementationOnce(() => features);
  });

  mapRef.current?.dispatchEvent({
    type: "click",
    // @ts-ignore
    pixel: [50, 50],
  });

  await waitFor(() => {
    expect(useLabellingStore.getState()).toMatchObject({
      selectedLabelId: label.id,
    });
  });
});
