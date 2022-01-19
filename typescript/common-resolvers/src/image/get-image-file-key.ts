import mime from "mime-types";

export const getImageFileKey = (
  imageId: string,
  workspaceId: string,
  datasetId: string,
  mimetype: string
) => `${workspaceId}/${datasetId}/${imageId}.${mime.extension(mimetype)}`;
