/* eslint-disable no-underscore-dangle */
import { ApolloClient, gql, NormalizedCacheObject } from "@apollo/client";
import { UploadTarget } from "@labelflow/graphql-types";

const getImageUploadTargetMutation = gql`
  mutation getUploadTarget($key: String!) {
    getUploadTarget(data: { key: $key }) {
      ... on UploadTargetDirect {
        direct
      }
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
  apolloClient: ApolloClient<NormalizedCacheObject>
) => {
  const uploadTarget = (
    await apolloClient.mutate<{ getUploadTarget: UploadTarget }>({
      mutation: getImageUploadTargetMutation,
      variables: { key },
    })
  )?.data?.getUploadTarget;

  if (!uploadTarget) {
    throw new Error("Couldn't get the upload target from the server");
  }

  if (uploadTarget.__typename !== "UploadTargetHttp") {
    throw new Error("Direct uploads are not supported anymore");
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
  apolloClient: ApolloClient<NormalizedCacheObject>;
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
