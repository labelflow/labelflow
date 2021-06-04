/* eslint-disable import/first */
// @ts-ignore Needs to be done before ol is imported
global.URL.createObjectURL = jest.fn(() => "mockedUrl");

import { ApolloProvider } from "@apollo/client";
import { Map } from "@labelflow/react-openlayers-fiber";
import { render, waitFor } from "@testing-library/react";
import gql from "graphql-tag";
import { Map as OlMap } from "ol";
import VectorLayer from "ol/layer/Vector";
import { client } from "../../../../connectors/apollo-client";
import { Labels } from "../labels";
import { LabelCreateInput } from "../../../../types.generated";
import { setupTestsWithLocalDatabase } from "../../../../utils/setup-local-db-tests";

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

it("Displays created labels", async () => {
  const mapRef: { current: OlMap | null } = { current: null };
  const imageId = await createImage("myImage");
  await createLabel({
    x: 3.14,
    y: 42.0,
    height: 768,
    width: 362,
    imageId,
  });

  render(<Labels imageId={imageId} />, {
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

  await waitFor(() => {
    expect(
      (mapRef.current?.getLayers().getArray()[0] as VectorLayer)
        .getSource()
        .getFeatures()
    ).toHaveLength(1);
  });
});
