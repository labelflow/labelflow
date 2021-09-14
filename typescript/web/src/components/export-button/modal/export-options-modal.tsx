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
import { ExportFormat, ExportOptions } from "@labelflow/graphql-types";
import { defaultOptions, formatsOptionsInformation, Format } from "./formats";

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
  exportFormat,
  exportFunction = () => {},
  onClose = () => {},
}: {
  isOpen?: boolean;
  exportFormat: ExportFormat;
  exportFunction?: (options: ExportOptions) => void;
  onClose?: () => void;
}) => {
  const [exportOptions, setExportOptions] =
    useState<ExportOptions>(defaultOptions);
  const exportFormatLowerCase = exportFormat.toLowerCase() as Format;
  const formatOptionsInformation =
    formatsOptionsInformation[exportFormatLowerCase];
  const optionsOfFormat = exportOptions[exportFormatLowerCase];
  
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
          {Object.keys(formatOptionsInformation ?? {}).map((optionName) => {
            const information = (
              formatOptionsInformation as Required<
                typeof formatOptionsInformation
              >
            )[optionName as keyof typeof formatOptionsInformation];
            return (
              <OptionLine
                key={optionName}
                header={information.title}
                description={information.description}
                isChecked={
                  optionsOfFormat[
                    optionName as keyof typeof optionsOfFormat
                  ] as boolean
                }
                onChange={() => {
                  setExportOptions((previousOptions) => ({
                    ...previousOptions,
                    [exportFormatLowerCase]: {
                      ...previousOptions[exportFormatLowerCase],
                      [optionName]:
                      // @ts-ignore
                        !previousOptions[exportFormatLowerCase][
                          // @ts-ignore
                          optionName as keyof typeof previousOptions[exportFormatLowerCase]
                        ],
                    },
                  }));
                }}
              />
            );
          })}
          <Button
            colorScheme="brand"
            size="md"
            alignSelf="flex-end"
            onClick={() => {
              exportFunction(exportOptions);
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
