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

export type UploadStatus = "loading" | "uploaded" | "error";

export type UploadInfo = {
  status: UploadStatus;
  error?: string;
  warnings?: string[];
};

/**
 * A lookup table containing only the status of
 * the file being uploaded
 */
export type UploadInfoRecord = Record<string, UploadInfo>;

/**
 * Setter function for the upload statuses
 */
export type SetUploadInfo = SetState<UploadInfoRecord>;
