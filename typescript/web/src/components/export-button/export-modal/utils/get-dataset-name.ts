import { ExportFormat } from "../../../../graphql-types/globalTypes";

export const getDatasetExportName = ({
  datasetSlug,
  format,
}: {
  datasetSlug: string;
  format: ExportFormat;
}) => {
  const dateObject = new Date();
  const date = `${dateObject
    .toLocaleDateString()
    .split("/")
    .reverse()
    .join("-")}T${String(dateObject.getHours()).padStart(2, "0")}${String(
    dateObject.getMinutes()
  ).padStart(2, "0")}${String(dateObject.getSeconds()).padStart(2, "0")}`;
  return `${datasetSlug}-${format.toLowerCase()}-${date}`;
};
