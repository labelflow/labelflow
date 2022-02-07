import { getDataset } from "@labelflow/common-resolvers/src/dataset";
import { getWorkspaceIdOfDataset } from "@labelflow/common-resolvers/src/image/get-workspace-id-of-dataset";
import { importAndProcessImage } from "@labelflow/common-resolvers/src/image/import-and-process-image";
import {
  Context,
  DbImageCreateInput,
} from "@labelflow/common-resolvers/src/types";
import { LabelType, Image, Label } from "@labelflow/graphql-types";
import { trim } from "lodash/fp";
import { v4 as uuidv4 } from "uuid";

export type CreateDatasetTutorialOptions = {
  name: string;
  workspaceSlug: string;
  labelClass: {
    name: string;
    color: string;
  };
  images: Omit<
    Image,
    "id" | "updatedAt" | "url" | "path" | "mimetype" | "dataset" | "labels"
  >[];
  labels: Omit<
    Label & { labelClassId: string | null },
    "id" | "createdAt" | "updatedAt" | "imageId"
  >[];
};

export const createTutorialDataset = async (
  _: any,
  args: CreateDatasetTutorialOptions,
  { repository, req, user }: Context
): Promise<any> => {
  const now = new Date().toISOString();
  const datasetId = uuidv4();
  const datasetName = trim(args.name);

  if (datasetName === "") {
    throw new Error("Could not create the dataset with an empty name");
  }

  const dbDataset = {
    id: datasetId,
    createdAt: now,
    updatedAt: now,
    name: datasetName,
    workspaceSlug: args.workspaceSlug,
  };

  try {
    await repository.dataset.add(dbDataset, user);

    const createdDataset = await getDataset(
      { id: datasetId },
      repository,
      user
    );
    const labelClass = args?.labelClass;
    const tutorialLabelClassId = uuidv4();
    const dbLabelClass = {
      id: tutorialLabelClassId,
      index: 0,
      createdAt: now,
      updatedAt: now,
      name: labelClass?.name ?? "",
      color: labelClass?.color,
      datasetId: createdDataset.id,
    };
    const createdLabelClass = await repository.labelClass.add(
      dbLabelClass,
      user
    );
    const datasetImages = args.images;
    const workspaceId = await getWorkspaceIdOfDataset({
      repository,
      datasetId,
      user,
    });

    const imagesToCreate: DbImageCreateInput[] = await Promise.all(
      datasetImages.map((imageToImport) =>
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

    const createdImages = await repository.image.list({
      id: { in: imageIds },
      user,
    });

    const imageWithLabelsId = (imageName: string) =>
      createdImages.find((image) => image.name === imageName);

    const originalLabels = args?.labels;

    const labelsToCreate = originalLabels.map((originalLabel) => {
      const labelId = uuidv4();

      return {
        ...originalLabel,
        type: originalLabel.type ?? LabelType.Polygon,
        labelClassId:
          originalLabel.labelClassId === null ? null : tutorialLabelClassId,
        id: labelId,
        createdAt: now,
        updatedAt: now,
      };
    });

    const createdLabels = await repository.label.addMany(
      {
        imageId: imageWithLabelsId("Image 4")?.id ?? "",
        labels: labelsToCreate,
      },
      user
    );

    return {
      ...createdDataset,
      ...createdImages,
      ...createdLabels,
      createdLabelClass,
    };
  } catch (e) {
    console.error(e);
    if (e instanceof Error) {
      throw new Error(
        `Could not create the dataset ${JSON.stringify(
          dbDataset
        )} due to error "${e?.message ?? e}"`
      );
    }
    throw new Error();
  }
};
