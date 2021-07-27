import {
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Button,
  Box,
  HStack,
  Text,
  Switch,
} from "@chakra-ui/react";
import { useState } from "react";

type ExportOptions = {
  exportImages: boolean;
};

const OptionLine = ({
  header,
  description,
  onChange = () => {},
}: {
  header: string;
  description: string;
  onChange?: any;
}) => (
  <Box pt="5" pb="5" pr="10" pl="10">
    <HStack justifyContent="space-between">
      <Box>
        <Heading size="md">{header}</Heading>
        <Text>{description}</Text>
      </Box>
      <Switch size="md" colorScheme="brand" onChange={onChange} />
    </HStack>
  </Box>
);

export const ExportOptionsModal = ({
  isOpen = false,
  onClick = () => {},
  onClose = () => {},
}: {
  isOpen?: boolean;
  onClick?: (input: ExportOptions) => void;
  onClose?: () => void;
}) => {
  const [options, setOptions] = useState<ExportOptions>({
    exportImages: false,
  });
  return (
    <Modal
      scrollBehavior="inside"
      isOpen={isOpen}
      size="xl"
      onClose={onClose}
      isCentered
    >
      <ModalOverlay />
      <ModalContent height="auto">
        <ModalHeader textAlign="center" padding="6">
          <Heading as="h2" size="lg" pb="2" color="gray.800">
            Export Options
          </Heading>
        </ModalHeader>

        <ModalBody
          display="flex"
          pt="0"
          pb="6"
          pr="6"
          pl="6"
          flexDirection="column"
        >
          <OptionLine
            header="Export image files"
            description="Zip images together with the annotation file"
            onChange={() => {
              setOptions((previousOptions) => ({
                ...previousOptions,
                exportImages: !previousOptions.exportImages,
              }));
            }}
          />
          <Button
            colorScheme="brand"
            size="md"
            alignSelf="flex-end"
            onClick={() => onClick(options)}
          >
            Export
          </Button>
        </ModalBody>
        <ModalCloseButton />
      </ModalContent>
    </Modal>
  );
};
