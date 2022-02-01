import { ExportFormat } from "../../../../graphql-types/globalTypes";

export const getDatasetExportName = ({
  datasetSlug,
  format,
}: {
  datasetSlug: string;
  format: ExportFormat;
}) => {
  const dateObject = new Date();
  // toLocaleDateString("fr") format is "01/11/1993"
  const [day, month, year] = dateObject.toLocaleDateString("fr").split("/");
  const date = `${year}-${month}-${day}`;
  // toLocaleTimeString("fr") format is "14:31:32"
  const time = dateObject.toLocaleTimeString("fr").replace(/:/g, "");
  const dateAndTime = `${date}T${time}`;
  return `${datasetSlug}-${format.toLowerCase()}-${dateAndTime}`;
};
