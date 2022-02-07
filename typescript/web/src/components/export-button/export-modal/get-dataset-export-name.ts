import { format } from "date-fns";
import { ExportFormat } from "../../../graphql-types/globalTypes";

export const getDatasetExportName = (
  datasetSlug: string,
  exportFormat: ExportFormat
) => {
  const dateAndTime = format(new Date(), "yyyy-MM-dd'T'hhmmss");
  return `${datasetSlug}-${exportFormat.toLowerCase()}-${dateAndTime}`;
};
