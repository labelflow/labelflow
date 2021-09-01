import { RiImageLine, RiFile3Line } from "react-icons/ri";
import { isEmpty } from "lodash/fp";
import { Box, Text, Flex, useColorModeValue as mode } from "@chakra-ui/react";

import { DroppedFile, UploadStatuses } from "../types";
import { ImportProgress } from "../import-progress";
import { ImportError } from "../import-error";

export const FilesStatuses = ({
  files,
  fileUploadStatuses,
}: {
  files: Array<DroppedFile>;
  fileUploadStatuses: UploadStatuses;
}) => (
  <Flex direction="column" height="100%">
    <Box p="2" bg={mode("gray.200", "gray.600")} borderTopRadius="md" w="100%">
      <Text>
        Completed{" "}
        {
          Object.entries(fileUploadStatuses).filter(
            (entry) => entry[1] === true
          ).length
        }{" "}
        of {files.filter((file) => isEmpty(file.errors)).length} items
      </Text>
    </Box>
    <Flex direction="column" overflowY="auto" width="100%" height="100%">
      {files.map(({ file, errors }, index) => (
        <Flex
          key={file.path}
          w="100%"
          alignItems="center"
          p="2"
          bg={index % 2 === 0 ? mode("gray.50", "gray.700") : "inherit"}
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
            color={mode("gray.400", "gray.600")}
            fontSize="md"
            textAlign="right"
          >
            {isEmpty(errors) ? (
              <ImportProgress
                status={fileUploadStatuses[file.path ?? file.name]}
              />
            ) : (
              <ImportError errors={errors} />
            )}
          </Box>
        </Flex>
      ))}
    </Flex>
  </Flex>
);
