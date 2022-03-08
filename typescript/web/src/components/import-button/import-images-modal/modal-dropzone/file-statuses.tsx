import { FileWithPath } from "react-dropzone";
import {
  RiImageLine,
  RiBracesLine,
  RiFolderZipLine,
  RiFile3Line,
} from "react-icons/ri";
import { isEmpty } from "lodash/fp";
import { Box, Text, Flex, useColorModeValue as mode } from "@chakra-ui/react";

import { DroppedFile, UploadInfoRecord, UploadInfo } from "../types";
import { ImportProgress } from "../import-progress";
import { ImportError } from "../import-error";

type FileStatusProps = {
  droppedFile: DroppedFile;
  index: number;
  fileUploadInfo?: UploadInfo;
};

const fileStatusIcon = (file: FileWithPath, hasErrors: boolean) => {
  if (hasErrors) {
    return RiFile3Line;
  }
  switch (file.type) {
    case "application/json":
      return RiBracesLine;
    case "application/zip":
      return RiFolderZipLine;
    default:
      return RiImageLine;
  }
};

const ImportStatus = ({
  droppedFile,
  fileUploadInfo,
}: Omit<FileStatusProps, "index">) => (
  <Box
    whiteSpace="nowrap"
    flex={0}
    color={mode("gray.400", "gray.600")}
    fontSize="md"
    textAlign="right"
  >
    {isEmpty(droppedFile.errors) ? (
      <ImportProgress status={fileUploadInfo?.status || false} />
    ) : (
      <ImportError errors={droppedFile.errors} />
    )}
  </Box>
);

const FilePath = ({ droppedFile }: Pick<FileStatusProps, "droppedFile">) => (
  <Box
    pr="2"
    flexGrow={1}
    flexShrink={1}
    overflow="hidden"
    textOverflow="ellipsis"
    whiteSpace="nowrap"
  >
    {droppedFile.file.path}
  </Box>
);

const Warnings = ({ warnings }: { warnings: string[] | undefined }) => (
  <>
    {warnings &&
      warnings.map((warning) => (
        <Box
          pr="2"
          overflow="hidden"
          textOverflow="ellipsis"
          fontSize="xs"
          color={mode("red.500", "red.300")}
        >
          {warning}
        </Box>
      ))}
  </>
);

const FileStatus = ({
  droppedFile,
  index,
  fileUploadInfo,
}: FileStatusProps) => {
  const warnings = fileUploadInfo?.warnings;
  const FileStatusIcon = fileStatusIcon(
    droppedFile.file,
    !isEmpty(droppedFile.errors)
  );
  return (
    <>
      <Flex
        key={droppedFile.file.path}
        w="100%"
        alignItems="center"
        p="2"
        bg={index % 2 === 0 ? mode("gray.50", "gray.700") : "inherit"}
      >
        <Box flex={0} pr="2">
          <FileStatusIcon />
        </Box>
        <FilePath droppedFile={droppedFile} />
        <ImportStatus
          droppedFile={droppedFile}
          fileUploadInfo={fileUploadInfo}
        />
      </Flex>
      <Warnings warnings={warnings} />
    </>
  );
};

export const FilesStatuses = ({
  files,
  fileUploadInfoRecord,
}: {
  files: Array<DroppedFile>;
  fileUploadInfoRecord: UploadInfoRecord;
}) => (
  <Flex direction="column" height="100%">
    <Box p="2" bg={mode("gray.200", "gray.600")} borderTopRadius="md" w="100%">
      <Text>
        Completed{" "}
        {
          Object.entries(fileUploadInfoRecord).filter(
            (entry) => entry[1].status === true
          ).length
        }{" "}
        of {files.filter((file) => isEmpty(file.errors)).length} items
      </Text>
    </Box>
    <Flex direction="column" overflowY="auto" width="100%" height="100%">
      {files.map((droppedFile, index) => (
        <FileStatus
          droppedFile={droppedFile}
          index={index}
          fileUploadInfo={
            fileUploadInfoRecord[droppedFile.file.path ?? droppedFile.file.name]
          }
        />
      ))}
    </Flex>
  </Flex>
);
