import {
  ModalBody as ChakraModalBody,
  SimpleGrid,
  Skeleton,
} from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
import { RiQuestionnaireLine } from "react-icons/ri";
import { APP_NEW_EXPORT_REQUEST_URL } from "../../../constants";
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
        <ExportCard
          colorScheme="brand"
          logoIcon={RiQuestionnaireLine}
          title="Request new Format"
          subtext="Let us know the export format you need"
          href={APP_NEW_EXPORT_REQUEST_URL}
        />
      </SimpleGrid>
    </ChakraModalBody>
  );
};
