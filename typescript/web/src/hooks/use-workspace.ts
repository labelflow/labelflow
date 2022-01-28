import { useRouterQueryString } from "./use-router-query-string";

export type UseWorkspaceResult = {
  workspaceSlug: string;
};

export const useWorkspace = (): UseWorkspaceResult => {
  const workspaceSlug = useRouterQueryString("workspaceSlug");
  return { workspaceSlug };
};
