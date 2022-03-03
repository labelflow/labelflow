import { isNil } from "lodash/fp";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";

export const ReorderableTableContext = createContext(false);

export type OnReorderCallback = (
  id: string,
  source: number,
  destination: number
) => void;

export type ReorderableTableProviderProps = PropsWithChildren<{
  onReorder: OnReorderCallback;
}>;

const useDragEnd = (
  setIsDragging: (value: boolean) => void,
  onReorder: OnReorderCallback
) => {
  return useCallback(
    ({ reason, draggableId, source, destination }: DropResult) => {
      if (reason === "DROP" && !isNil(destination)) {
        onReorder(draggableId, source.index, destination.index);
      }
      setIsDragging(false);
    },
    [onReorder, setIsDragging]
  );
};

export const ReorderableTableProvider = ({
  onReorder,
  children,
}: ReorderableTableProviderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const onBeforeDragStart = useCallback(() => setIsDragging(true), []);
  const onDragEnd = useDragEnd(setIsDragging, onReorder);
  return (
    <ReorderableTableContext.Provider value={isDragging}>
      <DragDropContext
        onBeforeDragStart={onBeforeDragStart}
        onDragEnd={onDragEnd}
      >
        {children}
      </DragDropContext>
    </ReorderableTableContext.Provider>
  );
};

export const useReorderableTable = () => useContext(ReorderableTableContext);
