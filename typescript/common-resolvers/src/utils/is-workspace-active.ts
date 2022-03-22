import { WorkspaceStatus } from "@labelflow/graphql-types";

export const isWorkspaceActive = (status: WorkspaceStatus) =>
  status === WorkspaceStatus.Active ||
  status === WorkspaceStatus.Trialing ||
  status === WorkspaceStatus.Incomplete;
