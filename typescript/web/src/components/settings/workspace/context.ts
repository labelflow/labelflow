import { createContext, useContext } from "react";
import { GetWorkspaceDetailsQuery_workspace } from "../../../graphql-types/GetWorkspaceDetailsQuery";

export const WorkspaceSettingsContext =
  createContext<GetWorkspaceDetailsQuery_workspace>(
    {} as GetWorkspaceDetailsQuery_workspace
  );

export const useWorkspaceSettings = () => useContext(WorkspaceSettingsContext);
