import create from "zustand";
import { createUndoStore } from "./zundo-effects";

export const useUndoStore = create(createUndoStore());
