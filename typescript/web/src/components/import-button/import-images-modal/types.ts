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

/**
 * A lookup table containing only the status of
 * the file being uploaded
 */
export type UploadStatuses = Record<string, boolean | string>;

export type UploadInfo = {
  status: boolean | string;
  datasetSkippedCrowdAnnotations?: number;
};
export type UploadInfos = Record<string, UploadInfo>;

/**
 * Setter function for the upload statuses
 */
export type SetUploadStatuses = SetState<UploadStatuses>;
export type SetUploadInfos = SetState<UploadInfos>;
