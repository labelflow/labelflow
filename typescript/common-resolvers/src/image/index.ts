import type {
  MutationCreateImageArgs,
  MutationCreateManyImagesArgs,
  MutationDeleteImageArgs,
  MutationDeleteManyImagesArgs,
  MutationUpdateImageArgs,
  QueryImageArgs,
  QueryImagesArgs,
} from "@labelflow/graphql-types";
import "isomorphic-fetch";
import {
  Context,
  DbImage,
  DbImageCreateInput,
  Repository,
  ThumbnailSizes,
} from "../types";
import { throwIfResolvesToNil } from "../utils/throw-if-resolves-to-nil";
import { getWorkspaceIdOfDataset } from "./get-workspace-id-of-dataset";
import { importAndProcessImage } from "./import-and-process-image";

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
  (size: ThumbnailSizes) =>
  async (dbImage: DbImage): Promise<string> => {
    const thumbnailProp = `thumbnail${size}Url`;
    if (thumbnailProp in dbImage) {
      return dbImage[thumbnailProp as keyof DbImage];
    }
    return dbImage.url ?? dbImage.externalUrl;
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
  const { datasetId } = args.data;

  // Since we don't have any constraint checks with Dexie
  // we need to ensure that the datasetId matches some
  // entity before being able to continue.
  await throwIfResolvesToNil(
    `The dataset id ${datasetId} doesn't exist.`,
    repository.dataset.get
  )({ id: datasetId }, user);

  const workspaceId = await getWorkspaceIdOfDataset({
    repository,
    datasetId,
    user,
  });

  const newImageEntity = await importAndProcessImage(
    { image: args.data, workspaceId },
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

  const workspaceId = await getWorkspaceIdOfDataset({
    repository,
    datasetId,
    user,
  });

  const imagesToCreate: DbImageCreateInput[] = await Promise.all(
    images.map((imageToImport) =>
      importAndProcessImage(
        { image: { ...imageToImport, datasetId }, workspaceId },
        { repository, req }
      )
    )
  );

  const imageIds = await repository.image.addMany(
    { datasetId, images: imagesToCreate },
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
  await repository.image.delete({ id: imageId }, user);
  await repository.upload.delete(imageToDelete.url);
  return imageToDelete;
};

const deleteManyImages = async (
  _: any,
  { where }: MutationDeleteManyImagesArgs,
  { repository, user }: Context
): Promise<number> => {
  const imagesToDelete = await throwIfResolvesToNil(
    "No images to delete",
    repository.image.list
  )({ ...where, user });
  const count = await repository.image.deleteMany(where, user);
  await Promise.all(
    imagesToDelete.map(({ url }) => repository.upload.delete(url))
  );
  return count;
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
  if (typename === "Workspace") {
    return await repository.workspace.countImages({ id: parent.id });
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
    deleteManyImages,
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

  Workspace: {
    imagesAggregates,
  },
};
