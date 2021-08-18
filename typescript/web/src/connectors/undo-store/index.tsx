import create from "zustand";
import { createUndoStore } from "./create-undo-store";

export type { Effect } from "./create-undo-store";

export const useUndoStore = create(createUndoStore());
