import "isomorphic-fetch";

import type {
  ImageCreateInput,
  MutationCreateImageArgs,
  MutationCreateManyImagesArgs,
  MutationUpdateImageArgs,
  QueryImageArgs,
  QueryImagesArgs,
  MutationDeleteImageArgs,
} from "@labelflow/graphql-types";
import { Context, DbImage, DbImageCreateInput, Repository } from "../types";
import { throwIfResolvesToNil } from "../utils/throw-if-resolves-to-nil";
import { getImageEntityFromMutationArgs } from "./get-image-entity-from-mutation-args";

const getImageById = async (
  id: string,
  repository: Repository,
  user?: { id: string }
): Promise<DbImage> => {
  return await throwIfResolvesToNil(
    `No image with id "${id}"`,
    repository.image.get
  )({ id }, user);
};

// Queries
const labelsResolver = async (
  { id }: DbImage,
  _args: any,
  { repository, user }: Context
) => {
  return await repository.label.list({ imageId: id, user });
};

const thumbnailResolver =
  (size: 20 | 50 | 100 | 200 | 500) =>
  async (dbImage: DbImage): Promise<string> => {
    return (
      (dbImage as unknown as { [key: string]: string })[
        `thumbnail${size}Url`
      ] ??
      dbImage.url ??
      dbImage.externalUrl
    );
  };

const image = async (
  _: any,
  args: QueryImageArgs,
  { repository, user }: Context
) => {
  return await getImageById(args?.where?.id, repository, user);
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

  const { workspaceSlug } = await repository.dataset.get(
    { id: datasetId },
    user
  );
  const { id: workspaceId } = await repository.workspace.get(
    {
      slug: workspaceSlug,
    },
    user
  );

  const newImageEntity = await getImageEntityFromMutationArgs(
    { image: args.data, workspaceId, user },
    { repository, req }
  );

  const newImageId = await repository.image.add(newImageEntity, user);

  const createdImage = await repository.image.get({ id: newImageId }, user);

  if (createdImage == null) {
    throw new Error("An error has occurred during image creation");
  }
  return createdImage;
};

const createManyImages = async (
  _: null,
  args: MutationCreateManyImagesArgs,
  { repository, req, user }: Context
): Promise<DbImage[]> => {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const { datasetId, images } = args.data;

  // Since we don't have any constraint checks with Dexie
  // we need to ensure that the datasetId matches some
  // entity before being able to continue.
  await throwIfResolvesToNil(
    `The dataset id ${datasetId} doesn't exist.`,
    repository.dataset.get
  )({ id: datasetId }, user);

  const { workspaceSlug } = (await repository.dataset.get(
    { id: datasetId },
    user
  )) as { workspaceSlug: string };
  const { id: workspaceId } = (await repository.workspace.get(
    {
      slug: workspaceSlug,
    },
    user
  )) as { id: string };

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const performOne = async (image: ImageCreateInput) => {
    const { file, url, externalUrl } = image;

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

    return await getImageEntityFromMutationArgs(
      { image, workspaceId, user },
      { repository, req }
    );
  };

  const imagesToCreate: DbImageCreateInput[] = await Promise.all(
    // eslint-disable-next-line @typescript-eslint/no-shadow
    images.map((image) => performOne({ ...image, datasetId }))
  );

  const imageIds = await repository.image.addMany(
    {
      datasetId,
      images: imagesToCreate,
    },
    user
  );

  return await repository.image.list({ id: { in: imageIds }, user });
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
  await repository.upload.delete(imageToDelete.url);

  return imageToDelete;
};

const updateImage = async (
  _: any,
  args: MutationUpdateImageArgs,
  { repository, user }: Context
) => {
  const imageId = args.where.id;

  const now = new Date();

  const newImageEntity = {
    ...args.data,
    updatedAt: now.toISOString(),
  };

  await repository.image.update({ id: imageId }, newImageEntity, user);

  return await getImageById(imageId, repository, user);
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
    createManyImages,
    updateImage,
    deleteImage,
  },

  Image: {
    labels: labelsResolver,
    thumbnail20Url: thumbnailResolver(20),
    thumbnail50Url: thumbnailResolver(50),
    thumbnail100Url: thumbnailResolver(100),
    thumbnail200Url: thumbnailResolver(200),
    thumbnail500Url: thumbnailResolver(500),
  },

  ImagesAggregates: { totalCount },

  Dataset: {
    imagesAggregates,
  },
};
