import { FileError } from "react-dropzone";

export type DroppedFile = {
  name: string;
  path?: string;
  errors: Array<FileError>;
};

export type FileUploadStatuses = Record<string, boolean>;
