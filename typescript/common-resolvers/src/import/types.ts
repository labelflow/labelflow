import { Context } from "../types";

export type ImportFunction = (zipBlob: Blob, context: Context) => void;
