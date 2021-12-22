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

export function throwIfInvalidImageInputs(input: {
  file: any | null | undefined;
  externalUrl: string | null | undefined;
  url: string | null | undefined;
}) {
  const { file, externalUrl, url } = input;
  if (
    !(
      (!file && !externalUrl && url) ||
      (!file && externalUrl && !url) ||
      (file && !externalUrl && !url)
    )
  ) {
    throw new Error(
      "Image creation upload must include either a `file` field of type `Upload`, or a `url` field of type `String`, or a `externalUrl` field of type `String`"
    );
  }
}
