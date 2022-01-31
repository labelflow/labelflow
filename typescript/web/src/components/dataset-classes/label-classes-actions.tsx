import { TableActions } from "../table-actions";
import { useDatasetClasses } from "./dataset-classes.context";
import { UpsertClassModal } from "./upsert-class-modal";

export const LabelClassesActions = () => {
  const { searchText, setSearchText, isCreating, setIsCreating } =
    useDatasetClasses();
  return (
    <>
      <UpsertClassModal
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
      />
      <TableActions
        searchText={searchText}
        setSearchText={setSearchText}
        onNewItem={() => setIsCreating(true)}
        searchBarLabel="Find a class"
        newButtonLabel="New class"
      />
    </>
  );
};
