import { ApolloClient, gql, NormalizedCacheObject } from "@apollo/client";
import { LabelCreateInput } from "../../typescript/graphql-types";

export const createDataset = async ({
  client,
  name,
  workspaceSlug,
}: {
  client: ApolloClient<NormalizedCacheObject>;
  name: string;
  workspaceSlug: string;
}) => {
  const mutationResult = await client.mutate({
    mutation: gql`
      mutation createDataset($name: String, $workspaceSlug: String) {
        createDataset(data: { name: $name, workspaceSlug: $workspaceSlug }) {
          id
          slug
        }
      }
    `,
    variables: {
      name,
      workspaceSlug,
    },
  });

  const {
    data: {
      createDataset: { id, slug },
    },
  } = mutationResult;

  return { id, slug };
};

export const createImage = async ({
  url,
  datasetId,
  client,
}: {
  url: string;
  datasetId: string;
  client: ApolloClient<NormalizedCacheObject>;
}) => {
  const mutationResult = await client.mutate({
    mutation: gql`
      mutation createImage($url: String, $datasetId: ID!) {
        createImage(data: { url: $url, datasetId: $datasetId }) {
          id
          name
          width
          height
          url
        }
      }
    `,
    variables: {
      datasetId,
      url,
    },
  });

  const {
    data: { createImage: image },
  } = mutationResult;

  return image;
};

export const createLabel = ({
  data,
  client,
}: {
  data: LabelCreateInput;
  client: ApolloClient<NormalizedCacheObject>;
}) => {
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

export const createLabelClass = async ({
  name,
  color = "#ffffff",
  datasetId,
  client,
}: {
  name: string;
  color: string;
  datasetId: string;
  client: ApolloClient<NormalizedCacheObject>;
}) => {
  const {
    data: {
      createLabelClass: { id },
    },
  } = await client.mutate({
    mutation: gql`
      mutation createLabelClass(
        $name: String!
        $color: String!
        $datasetId: ID!
      ) {
        createLabelClass(
          data: { name: $name, color: $color, datasetId: $datasetId }
        ) {
          id
          name
          color
        }
      }
    `,
    variables: {
      name,
      color,
      datasetId,
    },
  });

  return id;
};
