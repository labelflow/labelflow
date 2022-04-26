/* eslint-disable no-underscore-dangle */
import { ApolloClient, gql } from "@apollo/client";
import { UploadTargetHttp } from "@labelflow/graphql-types";

export const GET_IMAGE_UPLOAD_TARGET_MUTATION = gql`
  mutation GetUploadTargetMutation($key: String!) {
    getUploadTarget(data: { key: $key }) {
      ... on UploadTargetHttp {
        uploadUrl
        downloadUrl
      }
    }
  }
`;

/**
 * Retrieves the upload url and download url for the given key.
 * @param key - Unique key to identify the file in the storage
 * @param apolloClient - The apollo client to use for the mutation
 */
const getImageUploadTarget = async (
  key: string,
  apolloClient: ApolloClient<object>
) => {
  const uploadTarget = (
    await apolloClient.mutate<{ getUploadTarget: UploadTargetHttp }>({
      mutation: GET_IMAGE_UPLOAD_TARGET_MUTATION,
      variables: { key },
    })
  )?.data?.getUploadTarget;

  if (!uploadTarget) {
    throw new Error("Couldn't get the upload target from the server");
  }

  return uploadTarget;
};

/**
 * Uploads a file to the storage at the specify key
 * @remarks
 * Gets the upload url from the server.
 *
 * @param file - The blob or file to upload
 * @param key - Unique key to identify the file in the storage
 * @param apolloClient - The apollo client to use for the mutation
 * @returns The url to download the file
 */
export const uploadFile = async ({
  file,
  key,
  apolloClient,
}: {
  file: Blob;
  key: string;
  apolloClient: ApolloClient<object>;
}) => {
  const { downloadUrl, uploadUrl } = await getImageUploadTarget(
    key,
    apolloClient
  );

  await fetch(uploadUrl, {
    method: "PUT",
    body: file,
  });

  return downloadUrl;
};
