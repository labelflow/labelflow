import { RiImageLine, RiFile3Line } from "react-icons/ri";
import { isEmpty } from "lodash/fp";
import { Box, Text, Flex, useColorModeValue } from "@chakra-ui/react";

import { DroppedUrl, UploadInfoRecord } from "../types";
import { ImportProgress } from "../import-progress";
import { ImportError } from "../import-error";

export type UrlStatusesProps = {
  urls: Array<DroppedUrl>;
  uploadInfo: UploadInfoRecord;
};

export const UrlStatuses = ({ urls, uploadInfo }: UrlStatusesProps) => {
  const statusBg = useColorModeValue("gray.50", "gray.700");
  const progressColor = useColorModeValue("gray.400", "gray.600");
  return (
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
            Object.entries(uploadInfo).filter(
              (entry) => entry[1].status === "uploaded"
            ).length
          }{" "}
          of {urls.filter((url) => isEmpty(url.errors)).length} items
        </Text>
      </Box>
      <Flex direction="column" overflowY="auto" width="100%" height="100%">
        {urls.map(({ url, errors }, index) => (
          <Flex
            key={url}
            w="100%"
            alignItems="center"
            p="2"
            bg={index % 2 === 0 ? statusBg : "inherit"}
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
              {url}
            </Box>
            <Box
              whiteSpace="nowrap"
              flex={0}
              color={progressColor}
              fontSize="md"
              textAlign="right"
            >
              {isEmpty(errors) ? (
                <ImportProgress
                  {...(uploadInfo[url] ?? { status: "loading" })}
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
};
