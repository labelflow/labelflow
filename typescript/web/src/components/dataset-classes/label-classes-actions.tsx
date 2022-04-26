import { BiImport } from "react-icons/bi";
import { useCallback } from "react";
import { TableActions, TableActionButton } from "../table-actions";
import { useDatasetClasses } from "./dataset-classes.context";
import { AddClassesModal as AddClassesModalComponent } from "./add-classes-modal";

const DownloadAction = () => {
  const { onExportClasses } = useDatasetClasses();
  return (
    <TableActionButton
      variant="outline"
      icon={BiImport}
      onClick={onExportClasses}
      label="Download"
    />
  );
};

const AddClassesModal = () => {
  const { isCreating, setIsCreating } = useDatasetClasses();
  const handleClose = useCallback(() => setIsCreating(false), [setIsCreating]);
  return <AddClassesModalComponent isOpen={isCreating} onClose={handleClose} />;
};

export const LabelClassesActions = () => {
  const { searchText, setSearchText, setIsCreating } = useDatasetClasses();
  const handleAdd = useCallback(() => setIsCreating(true), [setIsCreating]);
  return (
    <>
      <AddClassesModal />
      <TableActions
        searchText={searchText}
        setSearchText={setSearchText}
        onNewItem={handleAdd}
        searchBarLabel="Find a class"
        newButtonLabel="New class"
      >
        <DownloadAction />
      </TableActions>
    </>
  );
};
