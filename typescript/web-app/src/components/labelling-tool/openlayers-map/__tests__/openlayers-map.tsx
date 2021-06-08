/* eslint-disable import/first */
// @ts-ignore Needs to be done before ol is imported
global.URL.createObjectURL = jest.fn(() => "mockedUrl");

import { Ref } from "react";
import { ApolloProvider } from "@apollo/client";
import { render, waitFor } from "@testing-library/react";
import useMeasure from "react-use-measure";
import gql from "graphql-tag";
import { Map as OlMap } from "ol";
import { client } from "../../../../connectors/apollo-client";
import { OpenlayersMap } from "../openlayers-map";
import { LabelCreateInput } from "../../../../graphql-types.generated";
import { setupTestsWithLocalDatabase } from "../../../../utils/setup-local-db-tests";
import { useLabellingStore } from "../../../../connectors/labelling-state";

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

it("should select label when user clicks on it", async () => {
  const mapRef: Ref<OlMap> = { current: null };
  const image = await createImage("myImage");
  const label = await createLabel({
    x: 100,
    y: 200,
    height: 100,
    width: 100,
    imageId: image.id,
  });

  render(<OpenlayersMap ref={mapRef} image={image} />, {
    wrapper: ({ children }) => (
      <ApolloProvider client={client}>{children}</ApolloProvider>
    ),
  });

  mapRef.current?.dispatchEvent({
    type: "click",
    // @ts-ignore
    pixel: [110, 210],
  });

  await waitFor(() => {
    expect(useLabellingStore.getState()).toMatchObject({
      selectedLabel: label.id,
    });
  });
});
