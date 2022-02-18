import { ExportOptionsCsv } from "@labelflow/graphql-types";
import {
  Options as StringifyCsvOptions,
  stringify as stringifyCsv,
} from "csv-stringify";
import { isNil } from "lodash";
import {
  Context,
  DbDataset,
  DbImage,
  DbLabel,
  DbLabelClass,
  DbWorkspaceWithType,
} from "../types";
import { ExportFunction } from "./types";

const stringifyCsvAsync = (
  rows: unknown[][],
  options?: StringifyCsvOptions
): Promise<string> =>
  new Promise((resolve, reject) => {
    stringifyCsv(rows, options, (error, output) => {
      if (error) {
        reject(error);
      } else {
        resolve(output);
      }
    });
  });

// https://github.com/labelflow/labelflow/issues/879
const CSV_HEADER = [
  "imageId",
  "imageName",
  "width",
  "height",
  "class",
  "xmin",
  "ymin",
  "xmax",
  "ymax",
];

const getDataset = async (
  datasetId: string,
  { repository, user }: Context
): Promise<DbDataset> => {
  const dataset = await repository.dataset.get({ id: datasetId }, user);
  if (isNil(dataset)) {
    throw new Error(`Could not find dataset with ID ${datasetId}`);
  }
  return dataset;
};

const getDatasetWorkspace = async (
  dataset: DbDataset,
  { repository, user }: Context
): Promise<DbWorkspaceWithType> => {
  const workspace = await repository.workspace.get(
    { slug: dataset.workspaceSlug },
    user
  );
  if (isNil(workspace)) {
    throw new Error(
      `Could not find workspace with slug ${dataset.workspaceSlug}`
    );
  }
  return workspace;
};

const getImage = (images: DbImage[], imageId: string): DbImage => {
  const image = images.find(({ id }) => id === imageId);
  if (!isNil(image)) return image;
  throw new Error(`Could not find image with ID ${imageId}`);
};

const getImageSignedUrl = async (
  workspaceId: string,
  datasetId: string,
  imageUrl: string,
  { repository }: Context
) => {
  const keyPrefix = `${workspaceId}/${datasetId}/`;
  const key = keyPrefix + imageUrl.split(keyPrefix)[1];
  return await repository.upload.getSignedDownloadUrl(key, 7 * 24 * 60 * 60);
};

const getLabelClass = (
  labelClasses: DbLabelClass[],
  labelClassId: string | null | undefined
): DbLabelClass => {
  const labelClass = labelClasses.find(({ id }) => id === labelClassId);
  if (!isNil(labelClass)) return labelClass;
  throw new Error(`Could not find class with ID ${labelClassId}`);
};

const createRow = async (
  workspaceId: string,
  datasetId: string,
  images: DbImage[],
  labelClasses: DbLabelClass[],
  { imageId, labelClassId, x, y, width, height }: DbLabel,
  options: ExportOptionsCsv = {},
  ctx: Context
): Promise<unknown[]> => {
  const image = getImage(images, imageId);
  const labelClassName = labelClassId
    ? getLabelClass(labelClasses, labelClassId).name
    : undefined;
  const row = [
    image.id,
    image.name,
    image.width,
    image.height,
    labelClassName,
    x,
    y,
    x + width,
    y + height,
  ];
  if (options.includeImageUrl)
    row.push(await getImageSignedUrl(workspaceId, datasetId, image.url, ctx));
  return row;
};

const createRows = async (
  workspaceId: string,
  datasetId: string,
  images: DbImage[],
  labelClasses: DbLabelClass[],
  labels: DbLabel[],
  options: ExportOptionsCsv = {},
  ctx: Context
): Promise<unknown[][]> =>
  await Promise.all(
    labels.map((label) =>
      createRow(
        workspaceId,
        datasetId,
        images,
        labelClasses,
        label,
        options,
        ctx
      )
    )
  );

const createRowsFromDb = async (
  datasetId: string,
  options: ExportOptionsCsv = {},
  ctx: Context
): Promise<unknown[][]> => {
  const { repository } = ctx;
  const dataset = await getDataset(datasetId, ctx);
  const workspace = await getDatasetWorkspace(dataset, ctx);
  const images = await repository.image.list({ datasetId, user: ctx.user });
  const labelClasses = await repository.labelClass.list({
    datasetId: dataset.id,
    user: ctx.user,
  });
  const labels = await repository.label.list({ datasetId, user: ctx.user });
  return await createRows(
    workspace.id,
    datasetId,
    images,
    labelClasses,
    labels,
    options,
    ctx
  );
};

export const exportToCsv: ExportFunction<ExportOptionsCsv> = async (
  datasetId,
  options = {},
  ctx
) => {
  const rows = await createRowsFromDb(datasetId, options, ctx);
  const csv = await stringifyCsvAsync(rows, {
    header: true,
    columns: options.includeImageUrl ? [...CSV_HEADER, "imageUrl"] : CSV_HEADER,
  });
  return new Blob([csv], { type: "application/csv" });
};