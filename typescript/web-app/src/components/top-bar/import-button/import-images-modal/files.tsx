import {
  RiImageLine,
  RiFile3Line,
  RiCheckboxCircleFill,
  RiContrastFill,
} from "react-icons/ri";
import { isEmpty } from "lodash/fp";
import {
  chakra,
  Box,
  Table,
  Tbody,
  Tooltip,
  Tr,
  Td,
  Text,
} from "@chakra-ui/react";
import { DroppedFile, FileUploadStatuses } from "./types";

const SucceedIcon = chakra(RiCheckboxCircleFill);
const LoadingIcon = chakra(RiContrastFill);

export const Files = ({
  files,
  fileUploadStatuses,
}: {
  files: Array<DroppedFile>;
  fileUploadStatuses: FileUploadStatuses;
}) => (
  <>
    <Box p="2" bg="gray.200" borderTopRadius="md">
      <Text>
        Completed{" "}
        {Object.entries(fileUploadStatuses).filter((entry) => entry[1]).length}{" "}
        of {files.length} items
      </Text>
    </Box>
    <Box as="section" overflowY="auto">
      <Table size="sm" variant="stripped">
        <Tbody>
          {files.map(({ file, errors }, index) => {
            const { path, name } = file;

            return (
              <Tr key={path} bg={index % 2 === 0 ? "gray.50" : "inherit"}>
                <Td pl="2" pr="2" fontSize="xl">
                  {isEmpty(errors) ? <RiImageLine /> : <RiFile3Line />}
                </Td>
                <Td pl="0" fontSize="md" lineHeight="md">
                  <Tooltip label={path}>
                    <Text isTruncated maxWidth="sm" textAlign="left">
                      {path}
                    </Text>
                  </Tooltip>
                </Td>
                {isEmpty(errors) ? (
                  <Td fontSize="xl" textAlign="right">
                    {fileUploadStatuses[path ?? name] ? (
                      <Tooltip label="Upload succeed" placement="left">
                        <span>
                          <SucceedIcon
                            display="inline-block"
                            color="green.500"
                            aria-label="Upload succeed"
                          />
                        </span>
                      </Tooltip>
                    ) : (
                      <Tooltip label="Loading indicator" placement="left">
                        <span>
                          <LoadingIcon
                            display="inline-block"
                            color="gray.800"
                            aria-label="Loading indicator"
                          />
                        </span>
                      </Tooltip>
                    )}
                  </Td>
                ) : (
                  <Td color="gray.400" fontSize="md" textAlign="right">
                    {errors.length === 1 ? (
                      <Tooltip label={errors[0].message} placement="left">
                        <Text as="span">
                          {errors[0].code === "file-invalid-type"
                            ? "Incompatible file format"
                            : errors[0].message}
                        </Text>
                      </Tooltip>
                    ) : (
                      <Tooltip
                        label={errors.map((e) => e.message).join(". ")}
                        placement="left"
                      >
                        <Text as="span" color="red.600">
                          {errors.length} errors
                        </Text>
                      </Tooltip>
                    )}
                  </Td>
                )}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Box>
  </>
);
