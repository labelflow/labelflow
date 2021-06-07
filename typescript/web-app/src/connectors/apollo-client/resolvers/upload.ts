import type {
  UploadTarget,
  UploadTargetDirect,
  UploadTargetHttp,
} from "../../../graphql-types.generated";

/**
 * A way for the server to tell how it wants to accept file uploads
 * @returns a presigned URL for the client to upload files to, or `null` if the server wants to accept direct graphql uploads
 */
const getUploadTarget = async (): Promise<UploadTarget> => {
  return { direct: true };
};

export default {
  Mutation: {
    getUploadTarget,
  },

  UploadTarget: {
    // See https://www.apollographql.com/docs/apollo-server/schema/unions-interfaces/#resolving-a-union
    // eslint-disable-next-line no-underscore-dangle
    __resolveType(obj: UploadTarget) {
      if (
        (obj as UploadTargetDirect).direct === false ||
        (obj as UploadTargetDirect).direct === true
      ) {
        return "UploadTargetDirect";
      }
      if (
        (obj as UploadTargetHttp).uploadUrl &&
        (obj as UploadTargetHttp).downloadUrl
      ) {
        return "UploadTargetHttp";
      }
      return null; // GraphQLError is thrown
    },
  },
};
