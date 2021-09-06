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

export type ExportOptions = {
  exportImages: boolean;
};

const OptionLine = ({
  header,
  description,
  isChecked,
  onChange = () => {},
}: {
  header: string;
  description: string;
  isChecked: boolean;
  onChange?: any;
}) => (
  <Box pt="5" pb="5" pr="10" pl="10">
    <HStack justifyContent="space-between">
      <Box>
        <Heading size="md">{header}</Heading>
        <Text>{description}</Text>
      </Box>
      <Switch
        isChecked={isChecked}
        size="md"
        colorScheme="brand"
        onChange={onChange}
      />
    </HStack>
  </Box>
);

export const ExportOptionsModal = ({
  isOpen = false,
  exportFunction = () => {},
  onClose = () => {},
}: //   options = { exportImages: false },
//   setOptions = () => {},
{
  isOpen?: boolean;
  exportFunction?: (options: ExportOptions) => void;
  onClose?: () => void;
  //   options: ExportOptions;
  //   setOptions?: Dispatch<SetStateAction<ExportOptions>>;
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
          <Heading as="h2" size="lg" pb="2">
            Export Options
          </Heading>
        </ModalHeader>

        <ModalBody
          display="flex"
          p={{ base: "2", md: "6" }}
          flexDirection="column"
        >
          <OptionLine
            header="Export image files"
            description="Zip images together with the annotation file"
            isChecked={options.exportImages}
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
            onClick={() => {
              exportFunction(options);
              onClose();
            }}
          >
            Export
          </Button>
        </ModalBody>
        <ModalCloseButton />
      </ModalContent>
    </Modal>
  );
};
