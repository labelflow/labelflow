import {
  ModalBody as ChakraModalBody,
  SimpleGrid,
  Skeleton,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { Dispatch, SetStateAction } from "react";
import { APP_CANNY_EXPORT_FORMATS_URL } from "../../../constants";
import { ExportCard } from "./export-card";
import { ExportFormatCard } from "./export-format-card";
import { useExportModal } from "./export-modal.context";
import { formatMainInformation } from "./formats";

export interface ModalBodyProps {
  setIsOptionsModalOpen: Dispatch<SetStateAction<boolean>>;
}
export const ModalBody = () => {
  const { loading } = useExportModal();
  return (
    <ChakraModalBody
      display="flex"
      pt={0}
      pl={6}
      pr={6}
      pb={6}
      flexDirection="column"
    >
      <SimpleGrid
        columns={{ base: 1, md: 2 }}
        spacing="4"
        justifyContent="center"
        pt={6}
        pl={8}
        pr={8}
        pb={8}
        flexWrap="wrap"
      >
        {Object.keys(formatMainInformation).map((formatKey) => {
          return (
            <Skeleton
              w="fit-content"
              m="auto"
              isLoaded={!loading}
              key={formatKey}
            >
              <ExportFormatCard formatKey={formatKey} colorScheme="brand" />
            </Skeleton>
          );
        })}
        <NextLink href={APP_CANNY_EXPORT_FORMATS_URL} passHref>
          <a
            href={APP_CANNY_EXPORT_FORMATS_URL}
            target="_blank"
            rel="noreferrer"
          >
            <ExportCard
              colorScheme="brand"
              logoSrc="/static/export-formats/request.svg"
              title="Request new Format"
              subtext="Let us know the export format you need"
            />
          </a>
        </NextLink>
      </SimpleGrid>
    </ChakraModalBody>
  );
};
