import { TableActions } from "../table-actions";
import { useWorkspace } from "./workspaces-context";

export const WorkspaceTableActions = () => {
  const { searchText, setSearchText, openCreateWorkspaceModal } =
    useWorkspace();
  return (
    <TableActions
      searchText={searchText}
      setSearchText={setSearchText}
      onNewItem={openCreateWorkspaceModal}
      searchBarLabel="Find a workspace"
      newButtonLabel="New workspace"
    />
  );
};
