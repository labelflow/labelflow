import { ExportOptionsCsv } from "@labelflow/graphql-types";
import {
  Options as StringifyCsvOptions,
  stringify as stringifyCsv,
} from "csv-stringify";
import { isNil } from "lodash";
import { Context, DbDataset, DbImage, DbLabel, DbLabelClass } from "../types";
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

// https://roboflow.com/formats/tensorflow-object-detection-csv
const CSV_HEADER = [
  "filename",
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

const getImage = (images: DbImage[], imageId: string): DbImage => {
  const image = images.find(({ id }) => id === imageId);
  if (!isNil(image)) return image;
  throw new Error(`Could not find image with ID ${imageId}`);
};

const getLabelClass = (
  labelClasses: DbLabelClass[],
  labelClassId: string | null | undefined,
  imageId: string
): DbLabelClass => {
  const labelClass = labelClasses.find(({ id }) => id === labelClassId);
  if (!isNil(labelClass)) return labelClass;
  throw new Error(`Could not find image with ID ${imageId}`);
};

const createRow = (
  images: DbImage[],
  labelClasses: DbLabelClass[],
  { imageId, labelClassId, x, y, width, height }: DbLabel
): unknown[] => {
  const image = getImage(images, imageId);
  const labelClass = getLabelClass(labelClasses, labelClassId, imageId);
  return [
    image.name ?? image.id,
    image.width,
    image.height,
    labelClass.name,
    x,
    y,
    x + width,
    y + height,
  ];
};

const createRows = (
  images: DbImage[],
  labelClasses: DbLabelClass[],
  labels: DbLabel[]
): unknown[][] => labels.map((label) => createRow(images, labelClasses, label));

const createRowsFromDb = async (
  datasetId: string,
  ctx: Context
): Promise<unknown[][]> => {
  const { repository } = ctx;
  const dataset = await getDataset(datasetId, ctx);
  const images = await repository.image.list({ datasetId });
  const labelClasses = await repository.labelClass.list({
    datasetId: dataset.id,
  });
  const labels = await repository.label.list({ datasetId });
  return createRows(images, labelClasses, labels);
};

export const exportCsv: ExportFunction<ExportOptionsCsv> = async (
  datasetId,
  _options,
  ctx
) => {
  const rows = await createRowsFromDb(datasetId, ctx);
  const csv = await stringifyCsvAsync(rows, {
    header: true,
    columns: CSV_HEADER,
  });
  return new Blob([csv], { type: "application/csv" });
};
