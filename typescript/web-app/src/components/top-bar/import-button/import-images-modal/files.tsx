import {
  RiImageLine,
  RiFile3Line,
  RiCheckboxCircleFill,
  RiContrastFill,
} from "react-icons/ri";
import { isEmpty } from "lodash/fp";
import { chakra, Box, Tooltip, Text, Flex } from "@chakra-ui/react";
import { FileError } from "react-dropzone";

import { DroppedFile, FileUploadStatuses } from "./types";

const SucceedIcon = chakra(RiCheckboxCircleFill);
const LoadingIcon = chakra(RiContrastFill);

const FileImportProgress = ({ imported }: { imported: boolean }) => {
  if (imported) {
    return (
      <Tooltip label="Upload succeed" placement="left">
        <span>
          <SucceedIcon
            display="inline-block"
            color="green.500"
            aria-label="Upload succeed"
          />
        </span>
      </Tooltip>
    );
  }

  return (
    <Tooltip label="Loading indicator" placement="left">
      <span>
        <LoadingIcon
          display="inline-block"
          color="gray.800"
          aria-label="Loading indicator"
        />
      </span>
    </Tooltip>
  );
};

const FileImportError = ({ errors }: { errors: Array<FileError> }) => {
  if (errors.length === 1) {
    return (
      <Tooltip label={errors[0].message} placement="left">
        <Text as="span">
          {errors[0].code === "file-invalid-type"
            ? "File type must be jpeg, png or bmp"
            : errors[0].message}
        </Text>
      </Tooltip>
    );
  }

  return (
    <Tooltip label={errors.map((e) => e.message).join(". ")} placement="left">
      <Text as="span" color="red.600">
        {errors.length} errors
      </Text>
    </Tooltip>
  );
};

export const Files = ({
  files,
  fileUploadStatuses,
}: {
  files: Array<DroppedFile>;
  fileUploadStatuses: FileUploadStatuses;
}) => (
  <Flex direction="column" height="100%">
    <Box p="2" bg="gray.200" borderTopRadius="md" w="100%">
      <Text>
        Completed{" "}
        {Object.entries(fileUploadStatuses).filter((entry) => entry[1]).length}{" "}
        of {Object.keys(fileUploadStatuses).length} items
      </Text>
    </Box>
    <Flex direction="column" overflowY="auto" width="100%" height="100%">
      {files.map(({ file, errors }, index) => (
        <Flex
          key={file.path}
          w="100%"
          alignItems="center"
          p="2"
          bg={index % 2 === 0 ? "gray.50" : "inherit"}
        >
          <Box flex={0} pr="2">
            {isEmpty(errors) ? <RiImageLine /> : <RiFile3Line />}
          </Box>
          <Box
            pr="2"
            flexGrow={1}
            flexShrink={1}
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
          >
            {file.path}
          </Box>
          <Box
            whiteSpace="nowrap"
            flex={0}
            color="gray.400"
            fontSize="md"
            textAlign="right"
          >
            {isEmpty(errors) ? (
              <FileImportProgress
                imported={fileUploadStatuses[file.path ?? file.name]}
              />
            ) : (
              <FileImportError errors={errors} />
            )}
          </Box>
        </Flex>
      ))}
    </Flex>
  </Flex>
);
