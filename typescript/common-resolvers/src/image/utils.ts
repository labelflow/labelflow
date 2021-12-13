import mime from "mime-types";

// Mutations

export const getImageFileKey = (
  imageId: string,
  workspaceId: string,
  datasetId: string,
  mimetype: string
) => `${workspaceId}/${datasetId}/${imageId}.${mime.extension(mimetype)}`;

export const getImageName = ({
  externalUrl,
  finalUrl,
  name,
}: {
  externalUrl?: string | null;
  finalUrl?: string | null;
  name?: string | null;
}): string => {
  const nameBase =
    name ??
    externalUrl?.substring(
      externalUrl?.lastIndexOf("/") + 1,
      externalUrl?.indexOf("?")
    ) ??
    finalUrl!.substring(finalUrl!.lastIndexOf("/") + 1, finalUrl!.indexOf("?"));
  return nameBase.replace(/\.[^/.]+$/, "");
};
