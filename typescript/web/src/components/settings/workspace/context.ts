import { Workspace } from "@labelflow/graphql-types";
import { createContext, useContext } from "react";

export const WorkspaceSettingsContext =
  createContext<Workspace | undefined>(undefined);

export const useWorkspaceSettings = () => useContext(WorkspaceSettingsContext);
