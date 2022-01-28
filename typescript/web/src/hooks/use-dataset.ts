import { useRouterQueryString } from "./use-router-query-string";
import { useWorkspace, UseWorkspaceResult } from "./use-workspace";

export type UseDatasetResult = UseWorkspaceResult & {
  datasetSlug: string;
};

export const useDataset = (): UseDatasetResult => {
  const workspaceState = useWorkspace();
  const datasetSlug = useRouterQueryString("datasetSlug");
  return { ...workspaceState, datasetSlug };
};
