import { Workspace } from "@labelflow/graphql-types";
import { createContext, PropsWithChildren, useContext, useState } from "react";

export type GqlWorkspace = Pick<
  Workspace,
  "id" | "name" | "slug" | "plan" | "image"
>;

export type WorkspacesProps = {
  workspaces: GqlWorkspace[];
  openCreateWorkspaceModal: () => void;
};

export type WorkspaceState = {
  searchText: string;
  setSearchText: (text: string) => void;
  openCreateWorkspaceModal: () => void;
  workspaces: GqlWorkspace[];
  filteredWorkspaces: GqlWorkspace[];
};

const WorkspaceContext = createContext({} as WorkspaceState);

export type WorkspacesContextProps = PropsWithChildren<WorkspacesProps>;

export const WorkspacesContextProvider = ({
  openCreateWorkspaceModal,
  workspaces,
  children,
}: WorkspacesContextProps) => {
  const [searchText, setSearchText] = useState("");
  const filteredWorkspaces = workspaces.filter((workspace) =>
    workspace.name.toLowerCase().includes(searchText.toLowerCase())
  );
  const state: WorkspaceState = {
    searchText,
    setSearchText,
    openCreateWorkspaceModal,
    workspaces,
    filteredWorkspaces,
  };
  return (
    <WorkspaceContext.Provider value={state}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => useContext(WorkspaceContext);
