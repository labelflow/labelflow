import { FileError, FileWithPath } from "react-dropzone";
import { SetState } from "../../../utils/types";

/**
 * Dropped file is intermediate file which let us
 * deal with rejected and accepted files at the same time
 */
export type DroppedFile = {
  file: FileWithPath;
  errors: Array<FileError>;
};

/**
 * Dropped url
 */
export type DroppedUrl = {
  url: string;
  errors: Array<Error>;
};

export type FileUploadStatus = "pending" | "uploaded" | "error";

export type FileUploadInfo = {
  status: FileUploadStatus;
  error?: string;
  warnings?: string[];
};

/**
 * A lookup table containing only the status of
 * the file being uploaded
 */
export type FileUploadInfoRecord = Record<string, FileUploadInfo>;

/**
 * Setter function for the upload statuses
 */
export type SetUploadInfoRecord = SetState<FileUploadInfoRecord>;
