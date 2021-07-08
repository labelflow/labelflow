/* eslint-disable import/order */
/* eslint-disable import/first */
// @ts-ignore Needs to be done before ol is imported
global.URL.createObjectURL = jest.fn(() => "mockedUrl");

import { ApolloProvider } from "@apollo/client";
import { Map } from "@labelflow/react-openlayers-fiber";
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import gql from "graphql-tag";
import { Map as OlMap } from "ol";

import VectorLayer from "ol/layer/Vector";
import { mockNextRouter } from "../../../../utils/router-mocks";

mockNextRouter();

import { useRouter } from "next/router";
import { client } from "../../../../connectors/apollo-client-schema";
import { Labels } from "../labels";
import { LabelCreateInput } from "../../../../graphql-types.generated";
import { useLabellingStore } from "../../../../connectors/labelling-state";
import { setupTestsWithLocalDatabase } from "../../../../utils/setup-local-db-tests";

setupTestsWithLocalDatabase();

const imageWidth = 500;
const imageHeight = 900;

const createImage = async (name: String) => {
  const mutationResult = await client.mutate({
    mutation: gql`
      mutation createImage(
        $file: Upload!
        $name: String!
        $width: Int
        $height: Int
      ) {
        createImage(
          data: { name: $name, file: $file, width: $width, height: $height }
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
    },
  });

  const {
    data: {
      createImage: { id },
    },
  } = mutationResult;

  return id;
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
    data: {
      createLabel: { id },
    },
  } = mutationResult;

  return id;
};

let imageId: string;

beforeEach(async () => {
  imageId = await createImage("myImage");

  (useRouter as jest.Mock).mockImplementation(() => ({
    query: { id: imageId },
  }));
});

it("displays a single label", async () => {
  const mapRef: { current: OlMap | null } = { current: null };

  await createLabel({
    x: 3.14,
    y: 42.0,
    height: 768,
    width: 362,
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
    x: 3.14,
    y: 42.0,
    height: 768,
    width: 362,
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

it("should delete selected label on delete key pressed", async () => {
  const mapRef: { current: OlMap | null } = { current: null };
  const labelId = await createLabel({
    x: 3.14,
    y: 42.0,
    height: 768,
    width: 362,
    imageId,
  });

  useLabellingStore.setState({ selectedLabelId: labelId });

  const { container } = render(<Labels />, {
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

  userEvent.type(container, "{delete}");

  await waitFor(() => {
    expect(
      (mapRef.current?.getLayers().getArray()[0] as VectorLayer)
        .getSource()
        .getFeatures()
    ).toHaveLength(0);

    expect(useLabellingStore.getState()).toMatchObject({
      selectedLabelId: null,
    });
  });
});

it("should not delete a label when none was selected", async () => {
  const mapRef: { current: OlMap | null } = { current: null };
  await createLabel({
    x: 3.14,
    y: 42.0,
    height: 768,
    width: 362,
    imageId,
  });

  const { container } = render(<Labels />, {
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

  userEvent.type(container, "{delete}");

  await waitFor(() => {
    expect(
      (mapRef.current?.getLayers().getArray()[0] as VectorLayer)
        .getSource()
        .getFeatures()
    ).toHaveLength(1);
  });
});
