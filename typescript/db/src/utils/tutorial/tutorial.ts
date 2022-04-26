import { importAndProcessImage } from "@labelflow/common-resolvers/src/image/import-and-process-image";
import {
  Context,
  DbImageCreateInput,
} from "@labelflow/common-resolvers/src/types";
import { getOrigin } from "@labelflow/common-resolvers/src/utils/get-origin";
import { v4 as uuidv4 } from "uuid";
import {
  getTutorialImages,
  getTutorialLabels,
  TUTORIAL_DATASET,
  TUTORIAL_LABEL_CLASS,
} from "./tutorial-data";

const createDataset = async (
  workspaceSlug: string,
  { repository, user }: Context
): Promise<string> => {
  const now = new Date().toISOString();
  const data = {
    ...TUTORIAL_DATASET,
    id: uuidv4(),
    workspaceSlug,
    createdAt: now,
    updatedAt: now,
  };
  return await repository.dataset.add(data, user);
};

const createImages = async (
  workspaceId: string,
  datasetId: string,
  ctx: Context
) => {
  const { repository, user, req } = ctx;
  const now = new Date();
  const origin = getOrigin(req);
  const images: DbImageCreateInput[] = await Promise.all(
    getTutorialImages(origin).map((image, index) => {
      const createdAt = new Date(now.getTime() + index).toISOString();
      const data = { ...image, noThumbnails: true, datasetId, createdAt };
      return importAndProcessImage({ image: data, workspaceId }, ctx);
    })
  );
  const imageIds = await repository.image.addMany({ datasetId, images }, user);
  return await repository.image.list({ id: { in: imageIds }, user });
};

const createLabelClass = async (
  datasetId: string,
  { repository, user }: Context
) => {
  const now = new Date().toISOString();
  const data = {
    ...TUTORIAL_LABEL_CLASS,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
    datasetId,
  };
  return await repository.labelClass.add(data, user);
};

const createLabels = async (
  defaultLabelClassId: string,
  imageId: string,
  { repository, user }: Context
) => {
  const now = new Date().toISOString();
  const labels = getTutorialLabels(defaultLabelClassId).map((label) => ({
    ...label,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
  }));
  return await repository.label.addMany({ imageId, labels }, user);
};

export const createTutorialDataset = async (
  workspaceId: string,
  workspaceSlug: string,
  ctx: Context
): Promise<void> => {
  const datasetId = await createDataset(workspaceSlug, ctx);
  const images = await createImages(workspaceId, datasetId, ctx);
  const labelClassId = await createLabelClass(datasetId, ctx);
  // TODO Extract this logic from the generic tutorial creation function
  const image4Id = images.find((image) => image.name === "Image 4")?.id ?? "";
  await createLabels(labelClassId, image4Id, ctx);
};
