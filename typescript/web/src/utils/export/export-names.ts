import { format } from "date-fns";

export const getDatasetExportName = (datasetSlug: string) => {
  const dateAndTime = format(new Date(), "yyyy-MM-dd'T'hhmmss");
  return `${datasetSlug}-${dateAndTime}`;
};

export const getDatasetClassesExportName = (datasetSlug: string) => {
  const dateAndTime = format(new Date(), "yyyy-MM-dd'T'hhmmss");
  return `${datasetSlug}-classes-${dateAndTime}`;
};
