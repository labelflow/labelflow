import { reorderArray } from "@labelflow/common-resolvers";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { OnReorderCallback } from "../reorderable-table";
import { useLabelClassesQuery } from "./label-classes.query";
import { useReorderLabelClassMutation } from "./reorder-label-class.mutation";
import { LabelClassWithShortcut } from "./types";

export interface LabelClassesState {
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
}

export const LabelClassesContext = createContext({} as LabelClassesState);

const addShortcutsToLabelClasses = (labelClasses: any[]) =>
  labelClasses.map((labelClass, index) => ({
    ...labelClass,
    shortcut: index > 9 ? null : `${(index + 1) % 10}`,
  }));

export interface LabelClassesProps {
  workspaceSlug: string;
  datasetSlug: string;
}

export type LabelClassesProviderProps = PropsWithChildren<LabelClassesProps>;

export const LabelClassesProvider = ({
  workspaceSlug,
  datasetSlug,
  children,
}: LabelClassesProviderProps) => {
  const [deleteClassId, setDeleteClassId] =
    useState<string | undefined>(undefined);
  const [editClass, setEditClass] =
    useState<LabelClassWithShortcut | undefined>(undefined);
  const [isCreating, setIsCreating] = useState(false);
  const [searchText, setSearchText] = useState("");
  const { data, loading, refetch, updateQuery } = useLabelClassesQuery(
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

  const value: LabelClassesState = {
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
  };

  return (
    <LabelClassesContext.Provider value={value}>
      {children}
    </LabelClassesContext.Provider>
  );
};

export const useLabelClasses = () => {
  return useContext(LabelClassesContext);
};
