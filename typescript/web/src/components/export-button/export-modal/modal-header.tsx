import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Heading,
  ModalHeader as ChakraModalHeader,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import { useExportModal } from "./export-modal.context";

export const ModalHeader = () => {
  const { labelsNumber, imagesNumber, numberUndefinedLabelsOfDataset } =
    useExportModal();
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
      <Box display="inline-block" width="100%" pl={8} pr={8} pt={4}>
        {
          // eslint-disable-next-line eqeqeq
          numberUndefinedLabelsOfDataset != null &&
            numberUndefinedLabelsOfDataset !== 0 && (
              <Alert status="warning" borderRadius={5}>
                <AlertIcon />
                <AlertTitle mr={2} fontSize={15} whiteSpace="nowrap">
                  Missing Class
                </AlertTitle>
                <AlertDescription fontSize={13} fontWeight="medium">
                  {`${numberUndefinedLabelsOfDataset} ${
                    numberUndefinedLabelsOfDataset === 1 ? "label" : "labels"
                  } ${
                    numberUndefinedLabelsOfDataset === 1 ? "has" : "have"
                  } no class assigned. Only labels with a class
            are exported.`}
                </AlertDescription>
              </Alert>
            )
        }
      </Box>
    </ChakraModalHeader>
  );
};
