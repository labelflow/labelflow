import { useDataset, UseDatasetResult } from "./use-dataset";
import { useRouterQueryString } from "./use-router-query-string";

export type UseDatasetImageResult = UseDatasetResult & {
  imageId: string;
};

export const useDatasetImage = (): UseDatasetImageResult => {
  const datasetState = useDataset();
  const imageId = useRouterQueryString("imageId");
  return { ...datasetState, imageId };
};
