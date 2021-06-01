import create from "zustand";
import { createUndoStore } from "./zundo-effects";

export const useStore = create(createUndoStore());
