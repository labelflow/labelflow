import { v4 as uuidv4 } from "uuid";
import type { UploadTarget } from "../../../graphql-types.generated";
import { windowExists } from "../../../utils/window-exists";

declare let self: ServiceWorkerGlobalScope;

/**
 * A way for the server to tell how it wants to accept file uploads
 * @returns a presigned URL for the client to upload files to, or `null` if the server wants to accept direct graphql uploads
 */
const getUploadTarget = async (): Promise<UploadTarget> => {
  if (windowExists) {
    // We run in the window scope
    return { direct: true };
  }
  // We run in the worker scope or nodejs
  const fileId = uuidv4();
  return {
    uploadUrl: `${self.location.protocol}//${self.location.host}/worker/images/${fileId}`,
    downloadUrl: `${self.location.protocol}//${self.location.host}/worker/images/${fileId}`,
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
