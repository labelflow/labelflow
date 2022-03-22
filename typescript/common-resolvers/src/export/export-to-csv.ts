import { ExportOptionsCsv } from "@labelflow/graphql-types";
import { isNil } from "lodash";
import { Context, DbDataset, DbImage, DbLabel, DbLabelClass } from "../types";
import { getSignedImageUrl, stringifyCsv } from "../utils";
import { ExportFunction } from "./types";

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
  "imageUrl",
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

const getImage = (images: DbImage[], imageId: string): DbImage => {
  const image = images.find(({ id }) => id === imageId);
  if (!isNil(image)) return image;
  throw new Error(`Could not find image with ID ${imageId}`);
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
  images: DbImage[],
  labelClasses: DbLabelClass[],
  { imageId, labelClassId, x, y, width, height }: DbLabel,
  ctx: Context
): Promise<unknown[]> => {
  const image = getImage(images, imageId);
  const labelClassName = labelClassId
    ? getLabelClass(labelClasses, labelClassId).name
    : undefined;
  const url = await getSignedImageUrl(image.url, ctx);
  const row = [
    image.id,
    image.name,
    image.width,
    image.height,
    labelClassName,
    Math.round(x),
    Math.round(y),
    Math.round(x + width),
    Math.round(y + height),
    url,
  ];
  return row;
};

const createRows = async (
  images: DbImage[],
  labelClasses: DbLabelClass[],
  labels: DbLabel[],
  ctx: Context
): Promise<unknown[][]> =>
  await Promise.all(
    labels.map((label) => createRow(images, labelClasses, label, ctx))
  );

const createRowsFromDb = async (
  datasetId: string,
  ctx: Context
): Promise<unknown[][]> => {
  const { repository } = ctx;
  const dataset = await getDataset(datasetId, ctx);
  const images = await repository.image.list({ datasetId, user: ctx.user });
  const labelClasses = await repository.labelClass.list({
    datasetId: dataset.id,
    user: ctx.user,
  });
  const labels = await repository.label.list({ datasetId, user: ctx.user });
  return await createRows(images, labelClasses, labels, ctx);
};

export const createCsv = async (
  datasetId: string,
  ctx: Context
): Promise<string> => {
  const rows = await createRowsFromDb(datasetId, ctx);
  const csv = await stringifyCsv(rows, {
    header: true,
    columns: CSV_HEADER,
  });
  return csv;
};

export const exportToCsv: ExportFunction<ExportOptionsCsv> = async (
  datasetId,
  _options,
  ctx
) => {
  const csv = await createCsv(datasetId, ctx);
  return new Blob([csv], { type: "application/csv" });
};
