import { FileWithPath } from "react-dropzone";
import {
  RiImageLine,
  RiBracesLine,
  RiFolderZipLine,
  RiFile3Line,
} from "react-icons/ri";
import { isEmpty } from "lodash/fp";
import { Box, Text, Flex, useColorModeValue as mode } from "@chakra-ui/react";

import { DroppedFile, UploadInfos, UploadInfo } from "../types";
import { ImportProgress } from "../import-progress";
import { ImportError } from "../import-error";

const FileStatusIcon = ({
  file,
  hasErrors,
}: {
  file: FileWithPath;
  hasErrors: boolean;
}) => {
  if (hasErrors) {
    return <RiFile3Line />;
  }
  switch (file.type) {
    case "application/json":
      return <RiBracesLine />;
    case "application/zip":
      return <RiFolderZipLine />;
    default:
      return <RiImageLine />;
  }
};

const FileStatus = ({
  droppedFile,
  index,
  fileUploadInfo,
}: {
  droppedFile: DroppedFile;
  index: number;
  fileUploadInfo?: UploadInfo;
}) => {
  const datasetSkippedCrowdAnnotations =
    fileUploadInfo?.datasetSkippedCrowdAnnotations;
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
          <FileStatusIcon
            file={droppedFile.file}
            hasErrors={!isEmpty(droppedFile.errors)}
          />
        </Box>
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
      </Flex>
      {datasetSkippedCrowdAnnotations && (
        <Box
          pr="2"
          overflow="hidden"
          textOverflow="ellipsis"
          fontSize="xs"
          color={mode("red.500", "red.300")}
        >
          {datasetSkippedCrowdAnnotations} RLE bitmap annotations were ignored.
          Only polygon annotations are supported.
        </Box>
      )}
    </>
  );
};

export const FilesStatuses = ({
  files,
  fileUploadInfos,
}: {
  files: Array<DroppedFile>;
  fileUploadInfos: UploadInfos;
}) => (
  <Flex direction="column" height="100%">
    <Box p="2" bg={mode("gray.200", "gray.600")} borderTopRadius="md" w="100%">
      <Text>
        Completed{" "}
        {
          Object.entries(fileUploadInfos).filter(
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
            fileUploadInfos[droppedFile.file.path ?? droppedFile.file.name]
          }
        />
      ))}
    </Flex>
  </Flex>
);
