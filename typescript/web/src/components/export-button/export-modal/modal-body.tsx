import {
  ModalBody as ChakraModalBody,
  Skeleton,
  Stack,
} from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
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
      <Stack
        direction={{ base: "column", md: "row" }}
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
      </Stack>
    </ChakraModalBody>
  );
};
