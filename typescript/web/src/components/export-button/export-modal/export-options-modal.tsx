import { useApolloClient } from "@apollo/client";
import {
  Box,
  Button,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Switch,
  Text,
} from "@chakra-ui/react";
import { ExportFormat } from "@labelflow/graphql-types";
import { isNil } from "lodash";
import { omit } from "lodash/fp";
import { useCallback, useEffect, useState } from "react";
import { ExportOptions } from "../../../graphql-types/globalTypes";
import { trackEvent } from "../../../utils/google-analytics";
import { exportDataset } from "./export-dataset";
import { useExportModal } from "./export-modal.context";
import { DEFAULT_EXPORT_OPTIONS, formatsOptionsInformation } from "./formats";

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
    <HStack justifyContent="space-between" alignItems="flex-start">
      <Box pr={10}>
        <Heading size="md">{header}</Heading>
        <Text textAlign="justify">{description}</Text>
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

export const ExportOptionsModal = () => {
  const {
    exportFormat,
    datasetId,
    datasetSlug,
    setIsExportRunning,
    isOptionsModalOpen,
    setIsOptionsModalOpen,
  } = useExportModal();
  const client = useApolloClient();
  const [exportOptions, setExportOptions] = useState<ExportOptions>(
    DEFAULT_EXPORT_OPTIONS
  );
  const exportFormatLowerCase =
    exportFormat.toLowerCase() as Lowercase<ExportFormat>;
  const formatOptionsInformation =
    formatsOptionsInformation[exportFormatLowerCase];
  const formatOptionsInformationArray = Object.entries(
    formatOptionsInformation ?? {}
  );
  const optionsOfFormat = omit(["name"], exportOptions[exportFormatLowerCase]);
  const exportFunction = useCallback(
    async (options: ExportOptions) => {
      if (isNil(datasetId)) return await Promise.resolve();
      return await exportDataset({
        datasetId,
        datasetSlug,
        setIsExportRunning,
        client,
        format: exportFormat,
        options,
      });
    },
    [client, datasetId, datasetSlug, exportFormat, setIsExportRunning]
  );

  const handleChange = useCallback(
    (optionName) => {
      setExportOptions((previousOptions) => {
        const prevOpts = previousOptions[exportFormatLowerCase];
        const optionKey = optionName as keyof typeof prevOpts;
        return {
          ...previousOptions,
          [exportFormatLowerCase]: {
            ...prevOpts,
            [optionName]: !prevOpts?.[optionKey],
          },
        };
      });
    },
    [exportFormatLowerCase]
  );

  const exportAction = useCallback(() => {
    exportFunction(exportOptions);
    trackEvent(`export_button_click_${exportFormat.toLocaleLowerCase()}`, {});
    setIsOptionsModalOpen(false);
  }, [exportFormat, exportFunction, exportOptions, setIsOptionsModalOpen]);

  useEffect(() => {
    if (isOptionsModalOpen && formatOptionsInformationArray.length === 0) {
      exportAction();
    }
  });

  return (
    <Modal
      scrollBehavior="inside"
      isOpen={isOptionsModalOpen}
      size="xl"
      onClose={() => setIsOptionsModalOpen(false)}
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
          {formatOptionsInformationArray.map(([optionName, information]) => {
            const optionKey =
              optionName as keyof typeof formatOptionsInformation;
            return (
              <OptionLine
                key={optionName}
                header={information.title}
                description={information.description}
                isChecked={optionsOfFormat?.[optionKey]}
                onChange={() => handleChange(optionName)}
              />
            );
          })}
          <Button
            colorScheme="brand"
            size="md"
            alignSelf="flex-end"
            flexShrink={0}
            onClick={exportAction}
          >
            Export
          </Button>
        </ModalBody>
        <ModalCloseButton />
      </ModalContent>
    </Modal>
  );
};
