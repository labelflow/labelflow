import { stringifyCsv } from "@labelflow/common-resolvers";
import {
  getDatasetClassesExportName,
  triggerClientDownload,
} from "../../utils";
import { LabelClassWithShortcut } from "./types";

export const generateCsv = (classes: LabelClassWithShortcut[]) => {
  const rows = classes.map((labelClass) => [labelClass.name]);
  return stringifyCsv(rows, { header: false });
};

export const exportDatasetClasses = async (
  datasetSlug: string,
  classes: LabelClassWithShortcut[]
) => {
  const csv = await generateCsv(classes);
  const csvFile = new Blob([csv], { type: "application/csv" });
  const exportName = getDatasetClassesExportName(datasetSlug);
  const fileName = `${exportName}.csv`;
  triggerClientDownload(csvFile, fileName);
};
