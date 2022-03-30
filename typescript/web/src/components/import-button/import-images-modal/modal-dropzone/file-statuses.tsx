import { FileWithPath } from "react-dropzone";
import {
  RiImageLine,
  RiBracesLine,
  RiFolderZipLine,
  RiFile3Line,
} from "react-icons/ri";
import { isEmpty } from "lodash/fp";
import { Box, Text, Flex, useColorModeValue } from "@chakra-ui/react";

import { DroppedFile, UploadInfoRecord, UploadInfo } from "../types";
import { ImportProgress } from "../import-progress";
import { ImportError } from "../import-error";

type FileStatusProps = {
  droppedFile: DroppedFile;
  index: number;
  uploadInfo: UploadInfo;
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
  uploadInfo,
}: Omit<FileStatusProps, "index">) => (
  <Box
    whiteSpace="nowrap"
    flex={0}
    color={useColorModeValue("gray.400", "gray.600")}
    fontSize="md"
    textAlign="right"
  >
    {isEmpty(droppedFile.errors) ? (
      <ImportProgress {...uploadInfo} />
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

type WarningProps = { warnings: string[] | undefined };

const Warnings = ({ warnings }: WarningProps) => {
  const color = useColorModeValue("red.500", "red.300");
  return (
    <>
      {warnings &&
        warnings.map((warning) => (
          <Box
            pr="2"
            overflow="hidden"
            textOverflow="ellipsis"
            fontSize="xs"
            color={color}
            key={warning}
          >
            {warning}
          </Box>
        ))}
    </>
  );
};

const FileStatus = ({ droppedFile, index, uploadInfo }: FileStatusProps) => {
  const warnings = uploadInfo?.warnings;
  const FileStatusIcon = fileStatusIcon(
    droppedFile.file,
    !isEmpty(droppedFile.errors)
  );
  const bg = useColorModeValue("gray.50", "gray.700");
  return (
    <>
      <Flex
        key={droppedFile.file.path}
        w="100%"
        alignItems="center"
        p="2"
        bg={index % 2 === 0 ? bg : "inherit"}
      >
        <Box flex={0} pr="2">
          <FileStatusIcon />
        </Box>
        <FilePath droppedFile={droppedFile} />
        <ImportStatus droppedFile={droppedFile} uploadInfo={uploadInfo} />
      </Flex>
      <Warnings warnings={warnings} />
    </>
  );
};

export type FilesStatusesProps = {
  files: Array<DroppedFile>;
  uploadInfo: UploadInfoRecord;
};

export const FilesStatuses = ({ files, uploadInfo }: FilesStatusesProps) => (
  <Flex direction="column" height="100%">
    <Box
      p="2"
      bg={useColorModeValue("gray.200", "gray.600")}
      borderTopRadius="md"
      w="100%"
    >
      <Text>
        Completed{" "}
        {
          Object.values(uploadInfo).filter(
            ({ status }) => status === "uploaded"
          ).length
        }{" "}
        of {files.filter((file) => isEmpty(file.errors)).length} items
      </Text>
    </Box>
    <Flex direction="column" overflowY="auto" width="100%" height="100%">
      {files.map((droppedFile, index) => (
        <FileStatus
          droppedFile={droppedFile}
          key={droppedFile.file.name}
          index={index}
          uploadInfo={
            uploadInfo[droppedFile.file.path ?? droppedFile.file.name] ?? {
              status: "loading",
            }
          }
        />
      ))}
    </Flex>
  </Flex>
);
