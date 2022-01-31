import {
  Heading,
  ModalHeader as ChakraModalHeader,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import { useExportModal } from "./export-modal.context";

export const ModalHeader = () => {
  const { labelsNumber, imagesNumber } = useExportModal();
  return (
    <ChakraModalHeader textAlign="center" pt={6} pl={6} pr={6} pb={0}>
      <Heading as="h2" size="lg" mb={3}>
        Export Labels
      </Heading>
      <Skeleton w="fit-content" m="auto" isLoaded={labelsNumber !== undefined}>
        <Text fontSize="lg" fontWeight="medium">
          Your dataset contains {imagesNumber} images and {labelsNumber} labels.
        </Text>
      </Skeleton>
    </ChakraModalHeader>
  );
};
