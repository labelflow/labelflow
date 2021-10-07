import { v4 as uuidv4 } from "uuid";
import "isomorphic-fetch";

import type {
  ImageCreateInput,
  MutationCreateImageArgs,
  QueryImageArgs,
  QueryImagesArgs,
  MutationDeleteImageArgs,
} from "@labelflow/graphql-types";
import mime from "mime-types";
import { probeImage } from "./utils/probe-image";
import { tutorialImages } from "./data/dataset-tutorial";
import { Context, DbImage, Repository, DbImageCreateInput } from "./types";
import { throwIfResolvesToNil } from "./utils/throw-if-resolves-to-nil";

// Mutations
const getImageFileKey = (
  imageId: string,
  datasetId: string,
  mimetype: string
) => `${datasetId}/${imageId}.${mime.extension(mimetype)}`;

const getImageName = ({
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

export const getImageEntityFromMutationArgs = async (
  data: ImageCreateInput,
  repository: Pick<Repository, "upload">,
  req?: Request
) => {
  const {
    file,
    id,
    name,
    height,
    width,
    mimetype,
    path,
    url,
    externalUrl,
    datasetId,
  } = data;
  const now = data?.createdAt ?? new Date().toISOString();
  const imageId = id ?? uuidv4();
  let finalUrl: string | undefined;
  if (!file && !externalUrl && url) {
    // No File Upload
    finalUrl = url;
  }

  if (!file && externalUrl && !url) {
    // External file based upload

    const headers = new Headers();
    headers.set("Accept", "image/tiff,image/jpeg,image/png,image/*,*/*;q=0.8");
    headers.set("Sec-Fetch-Dest", "image");
    if ((req?.headers as any)?.cookie) {
      headers.set("Cookie", (req?.headers as any)?.cookie);
    }

    const fetchResult = await fetch(externalUrl, {
      method: "GET",
      mode: "cors",
      headers,
      credentials: "omit",
    });

    if (fetchResult.status !== 200) {
      throw new Error(
        `While transfering image could not fetch image at url ${externalUrl} properly, code ${fetchResult.status}`
      );
    }

    const blob = await fetchResult.blob();
    const uploadTarget = await repository.upload.getUploadTargetHttp(
      getImageFileKey(imageId, datasetId, blob.type)
    );

    // eslint-disable-next-line no-underscore-dangle
    if (uploadTarget.__typename !== "UploadTargetHttp") {
      throw new Error(
        "This Server does not support file upload. You can create images by providing a `file` directly in the `createImage` mutation"
      );
    }

    finalUrl = uploadTarget.downloadUrl;
    await repository.upload.put(uploadTarget.uploadUrl, blob);
  }

  if (file && !externalUrl && !url) {
    // File Content based upload

    const uploadTarget = await repository.upload.getUploadTargetHttp(
      getImageFileKey(imageId, datasetId, file.type)
    );

    // eslint-disable-next-line no-underscore-dangle
    if (uploadTarget.__typename !== "UploadTargetHttp") {
      throw new Error(
        "This Server does not support file upload. You can create images by providing a `file` directly in the `createImage` mutation"
      );
    }
    finalUrl = uploadTarget.downloadUrl;

    await repository.upload.put(uploadTarget.uploadUrl, file);
  }

  // Probe the file to get its dimensions and mimetype if not provided
  const imageMetaData = await probeImage(
    {
      width,
      height,
      mimetype,
      url: finalUrl!,
    },
    (urlToProbe: string) => repository.upload.get(urlToProbe, req)
  );

  const newImageEntity: DbImageCreateInput = {
    datasetId,
    createdAt: now,
    updatedAt: now,
    id: imageId,
    url: finalUrl!,
    externalUrl,
    path: path ?? externalUrl ?? finalUrl!,
    name: getImageName({ externalUrl, finalUrl, name }),
    ...imageMetaData,
  };
  return newImageEntity;
};

// Queries
const labelsResolver = async (
  { id }: DbImage,
  _args: any,
  { repository, user }: Context
) => {
  return await repository.label.list({ imageId: id, user });
};

const image = async (
  _: any,
  args: QueryImageArgs,
  { repository, user }: Context
) => {
  return await throwIfResolvesToNil(
    `No image with id "${args?.where?.id}"`,
    repository.image.get
  )(args?.where, user);
};

const images = async (
  _: any,
  args: QueryImagesArgs,
  { repository, user }: Context
) => {
  return await repository.image.list(
    { ...args?.where, user },
    args?.skip,
    args?.first
  );
};

// Mutations
const createImage = async (
  _: any,
  args: MutationCreateImageArgs,
  { repository, req, user }: Context
): Promise<DbImage> => {
  const { file, url, externalUrl, datasetId } = args.data;

  // Since we don't have any constraint checks with Dexie
  // we need to ensure that the datasetId matches some
  // entity before being able to continue.
  await throwIfResolvesToNil(
    `The dataset id ${datasetId} doesn't exist.`,
    repository.dataset.get
  )({ id: datasetId }, user);

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

  const newImageEntity = await getImageEntityFromMutationArgs(
    args.data,
    repository,
    req
  );

  const newImageId = await repository.image.add(newImageEntity, user);
  const createdImage = await repository.image.get({ id: newImageId }, user);
  if (createdImage == null) {
    throw new Error("An error has occurred during image creation");
  }
  return createdImage;
};

const deleteImage = async (
  _: any,
  args: MutationDeleteImageArgs,
  { repository, user }: Context
): Promise<DbImage> => {
  const imageId = args.where.id;
  const imageToDelete = await throwIfResolvesToNil(
    "No image with such id",
    repository.image.get
  )({ id: imageId }, user);
  const labelsToDelete = await repository.label.list({
    imageId,
    user,
  });
  await Promise.all(
    labelsToDelete.map((label) =>
      repository.label.delete({ id: label.id }, user)
    )
  );
  await repository.image.delete({ id: imageId }, user);
  if (
    !tutorialImages.map((tutorialImage) => tutorialImage.id).includes(imageId)
  ) {
    await repository.upload.delete(imageToDelete.url);
  }

  return imageToDelete;
};

const imagesAggregates = (parent: any) => {
  // Forward `parent` to chained resolvers if it exists
  return parent ?? {};
};

const totalCount = async (
  parent: any,
  _args: any,
  { repository, user }: Context
) => {
  // eslint-disable-next-line no-underscore-dangle
  const typename = parent?.__typename;
  if (typename === "Dataset") {
    return await repository.image.count({
      datasetId: parent.id,
      user,
    });
  }

  return await repository.image.count({ user });
};

export default {
  Query: {
    image,
    images,
    imagesAggregates,
  },

  Mutation: {
    createImage,
    deleteImage,
  },

  Image: {
    labels: labelsResolver,
  },

  ImagesAggregates: { totalCount },

  Dataset: {
    imagesAggregates,
  },
};
