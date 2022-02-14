import { useRouterQueryString } from "./use-router-query-string";

export type UseDatasetImageResult = {
  id: string;
};

export const useDatasetImage = (): UseDatasetImageResult => {
  const id = useRouterQueryString("imageId");
  return { id };
};
