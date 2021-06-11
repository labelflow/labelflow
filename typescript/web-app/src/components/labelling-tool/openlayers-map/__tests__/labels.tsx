/* eslint-disable import/first */
// @ts-ignore Needs to be done before ol is imported
global.URL.createObjectURL = jest.fn(() => "mockedUrl");

import { ApolloProvider } from "@apollo/client";
import { Map } from "@labelflow/react-openlayers-fiber";
import { render, waitFor } from "@testing-library/react";
import gql from "graphql-tag";
import { Map as OlMap } from "ol";
import { useRouter } from "next/router";
import VectorLayer from "ol/layer/Vector";
import { client } from "../../../../connectors/apollo-client-schema";
import { Labels } from "../labels";
import { LabelCreateInput } from "../../../../graphql-types.generated";
import { setupTestsWithLocalDatabase } from "../../../../utils/setup-local-db-tests";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

setupTestsWithLocalDatabase();

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

const createLabel = (data: LabelCreateInput) => {
  return client.mutate({
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
};

it("displays a single label", async () => {
  const mapRef: { current: OlMap | null } = { current: null };
  const imageId = await createImage("myImage");
  await createLabel({
    x: 3.14,
    y: 42.0,
    height: 768,
    width: 362,
    imageId,
  });

  (useRouter as jest.Mock).mockImplementation(() => ({
    query: { id: imageId },
  }));

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
  const imageId = await createImage("myImage");
  await createLabel({
    x: 3.14,
    y: 42.0,
    height: 768,
    width: 362,
    imageId,
  });

  await createLabel({
    x: 6.28,
    y: 84.0,
    height: 768,
    width: 362,
    imageId,
  });

  (useRouter as jest.Mock).mockImplementation(() => ({
    query: { id: imageId },
  }));

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
