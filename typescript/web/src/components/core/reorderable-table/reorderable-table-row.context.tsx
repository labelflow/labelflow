import { createContext, useContext } from "react";
import { DraggableProvided } from "react-beautiful-dnd";

const ReorderableTableRowContext = createContext({} as DraggableProvided);

export const ReorderableTableRowProvider = ReorderableTableRowContext.Provider;

export const useReorderableTableRow = () =>
  useContext(ReorderableTableRowContext);
