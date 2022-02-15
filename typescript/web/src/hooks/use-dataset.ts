import { useRouterQueryString } from "./use-router-query-string";

export type UseDatasetResult = {
  slug: string;
};

export const useDataset = (): UseDatasetResult => {
  const slug = useRouterQueryString("datasetSlug");
  return { slug };
};
