import { createContext, PropsWithChildren, useContext, useState } from "react";
import { UserWithWorkspacesQuery_user_memberships_workspace } from "../../graphql-types/UserWithWorkspacesQuery";
import { useWorkspaces } from "../../hooks";

export type WorkspacesState = {
  /** Called when the new workspace button has been clicked */
  openCreateWorkspaceModal: () => void;
};

export type WorkspaceState = {
  searchText: string;
  setSearchText: (text: string) => void;
  openCreateWorkspaceModal: () => void;
  filteredWorkspaces: UserWithWorkspacesQuery_user_memberships_workspace[];
};

const WorkspaceContext = createContext({} as WorkspaceState);

export const useWorkspace = () => useContext(WorkspaceContext);

export type WorkspacesContextProps = PropsWithChildren<WorkspacesState>;

export const WorkspacesContextProvider = ({
  openCreateWorkspaceModal,
  children,
}: WorkspacesContextProps) => {
  const [searchText, setSearchText] = useState("");
  const workspaces = useWorkspaces();
  const filteredWorkspaces = workspaces.filter((workspace) =>
    workspace.name.toLowerCase().includes(searchText.toLowerCase())
  );
  const state: WorkspaceState = {
    searchText,
    setSearchText,
    openCreateWorkspaceModal,
    filteredWorkspaces,
  };
  return (
    <WorkspaceContext.Provider value={state}>
      {children}
    </WorkspaceContext.Provider>
  );
};
