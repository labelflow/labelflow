import { v4 as uuidv4 } from "uuid";
import type { UploadTarget } from "../../graphql-types.generated";
import { isInWindowScope } from "../../utils/detect-scope";

export const uploadsCacheName = "uploads";
export const uploadsRoute = "/api/worker/uploads";

declare let self: ServiceWorkerGlobalScope;

/**
 * A way for the server to tell how it wants to accept file uploads
 * @returns a presigned URL for the client to upload files to, or `null` if the server wants to accept direct graphql uploads
 */
export const getUploadTarget = async (): Promise<UploadTarget> => {
  if (isInWindowScope) {
    // We run in the window scope
    return { __typename: "UploadTargetDirect", direct: true };
  }
  // We run in the worker scope or nodejs
  const fileId = uuidv4();
  return {
    __typename: "UploadTargetHttp",
    // Upload and download URL do not have to be the same. But in our implementation it is:
    uploadUrl: `${self.location.protocol}//${self.location.host}${uploadsRoute}/${fileId}`,
    downloadUrl: `${self.location.protocol}//${self.location.host}${uploadsRoute}/${fileId}`,
  };
};

export default {
  Mutation: {
    getUploadTarget,
  },

  UploadTarget: {
    // See https://www.apollographql.com/docs/apollo-server/schema/unions-interfaces/#resolving-a-union
    // eslint-disable-next-line no-underscore-dangle
    __resolveType(obj: UploadTarget) {
      if ("direct" in obj) {
        return "UploadTargetDirect";
      }
      if ("uploadUrl" in obj || "downloadUrl" in obj) {
        return "UploadTargetHttp";
      }
      return null; // GraphQLError is thrown
    },
  },
};
