import { reorderArray } from "@labelflow/utils";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { OnReorderCallback } from "../core";
import { exportDatasetClasses } from "./dataset-classes-export";
import { useDatasetLabelClassesQuery } from "./dataset-classes.query";
import { useReorderLabelClassMutation } from "./reorder-label-class.mutation";
import { LabelClassWithShortcut } from "./types";

export interface DatasetClassesState {
  datasetSlug: string;
  datasetId?: string;
  deleteClassId?: string;
  setDeleteClassId(value: string | undefined): void;
  editClass?: LabelClassWithShortcut;
  setEditClass(value: LabelClassWithShortcut | undefined): void;
  isCreating: boolean;
  setIsCreating(value: boolean): void;
  searchText: string;
  setSearchText(value: string): void;
  labelClasses?: LabelClassWithShortcut[];
  loading: boolean;
  onReorder: OnReorderCallback;
  onExportClasses(): void;
}

export const DatasetClassesContext = createContext({} as DatasetClassesState);

const addShortcutsToLabelClasses = (labelClasses: any[]) =>
  labelClasses.map((labelClass, index) => ({
    ...labelClass,
    shortcut: index > 9 ? null : `${(index + 1) % 10}`,
  }));

export interface DatasetClassesProps {
  workspaceSlug: string;
  datasetSlug: string;
}

export type DatasetClassesProviderProps =
  PropsWithChildren<DatasetClassesProps>;

export const DatasetClassesProvider = ({
  workspaceSlug,
  datasetSlug,
  children,
}: DatasetClassesProviderProps) => {
  const [deleteClassId, setDeleteClassId] =
    useState<string | undefined>(undefined);
  const [editClass, setEditClass] =
    useState<LabelClassWithShortcut | undefined>(undefined);
  const [isCreating, setIsCreating] = useState(false);
  const [searchText, setSearchText] = useState("");
  const { data, loading, refetch, updateQuery } = useDatasetLabelClassesQuery(
    workspaceSlug,
    datasetSlug
  );
  const labelClasses = useMemo(
    () => addShortcutsToLabelClasses(data?.dataset.labelClasses ?? []),
    [data]
  );

  const [reorderLabelClass] = useReorderLabelClassMutation();

  const onReorder = useCallback<OnReorderCallback>(
    async (id, source, destination) => {
      updateQuery((prev) => {
        const reordered = reorderArray(
          prev?.dataset?.labelClasses,
          source,
          destination
        );
        const newLabelClasses = addShortcutsToLabelClasses(reordered);
        const dataset = { ...prev?.dataset, labelClasses: newLabelClasses };
        return { ...prev, dataset };
      });
      await reorderLabelClass({ variables: { id, index: destination } });
      refetch();
    },
    [refetch, reorderLabelClass, updateQuery]
  );

  const onExportClasses = useCallback(
    async () => await exportDatasetClasses(datasetSlug, labelClasses),
    [datasetSlug, labelClasses]
  );

  const value: DatasetClassesState = {
    datasetSlug,
    datasetId: data?.dataset.id,
    deleteClassId,
    setDeleteClassId,
    editClass,
    setEditClass,
    isCreating,
    setIsCreating,
    searchText,
    setSearchText,
    labelClasses,
    loading,
    onReorder,
    onExportClasses,
  };

  return (
    <DatasetClassesContext.Provider value={value}>
      {children}
    </DatasetClassesContext.Provider>
  );
};

export const useDatasetClasses = () => {
  return useContext(DatasetClassesContext);
};
