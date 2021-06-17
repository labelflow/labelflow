import { useState, useEffect } from "react";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  VStack,
  HStack,
  Button,
  Center,
  Text,
  Heading,
  ModalBody,
  ModalHeader,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { useQueryParam, StringParam } from "use-query-params";

import { Logo } from "../../logo";
import {} from "../../../utils/query-param-bool";

export const WelcomeModal = ({
  isServiceWorkerActive,
}: {
  isServiceWorkerActive: boolean;
}) => {
  // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Welcome-wizard
  // This param can have several values:
  //   - undefined: Normal behavior, only show the welcome modal when needed
  //   - "open": Force the welcome modal to open even if not needed
  //   - "closed": Don't ever open the welcome modal
  const [paramModalWelcome, setParamModalWelcome] = useQueryParam(
    "modal-welcome",
    StringParam
  );
  const [hasUserClickedStart, setHasUserClickedStart] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // This modal should open when isServiceWorkerActive becomes false
  // But close only when the use hasUserClickedStart becomes true
  useEffect(() => {
    if (
      (!isServiceWorkerActive &&
        !hasUserClickedStart &&
        !(paramModalWelcome === "closed")) ||
      paramModalWelcome === "open"
    ) {
      setIsOpen(true);
      return;
    }
    if (isServiceWorkerActive && hasUserClickedStart) {
      setIsOpen(false);
    }
    // In the 2 other cases, we do nothing, this is an hysteresis
    // To "latch" the modal to open once it opened once
  }, [isServiceWorkerActive, hasUserClickedStart, paramModalWelcome]);

  return (
    <Modal isOpen={isOpen} onClose={() => {}} size="3xl">
      <ModalOverlay />
      <ModalContent margin="3.75rem">
        <ModalHeader textAlign="center" padding="6">
          <Center>
            <Logo maxW="lg" mt="8" mb="8" />
          </Center>
        </ModalHeader>

        <ModalBody>
          <VStack
            justifyContent="space-evenly"
            spacing="8"
            h="full"
            mt="0"
            mb="8"
          >
            <Heading
              as="h1"
              size="2xl"
              maxW="lg"
              color={mode("gray.600", "gray.300")}
              fontWeight="extrabold"
              textAlign="center"
            >
              The open standard{" "}
              <Text color="brand.500" display="inline">
                image labeling tool
              </Text>
            </Heading>

            <Text
              color={mode("gray.600", "gray.400")}
              mt="16"
              maxW="lg"
              fontSize="lg"
              fontWeight="medium"
              textAlign="justify"
            >
              Create and manage your image data, workflows and teams in a single
              place. Stay in control of your data, focus on building the next
              big thing.
            </Text>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <HStack direction={{ base: "column", md: "row" }} spacing="4" mt="8">
            <Button
              as="a"
              href="https://github.com/Labelflow/labelflow"
              target="blank"
              size="lg"
              minW="210px"
              variant="link"
              height="14"
              px="8"
            >
              See code on Github
            </Button>

            <Button
              size="lg"
              minW="210px"
              colorScheme="brand"
              height="14"
              px="8"
              isLoading={hasUserClickedStart && !isServiceWorkerActive}
              onClick={() => {
                setParamModalWelcome(undefined, "replaceIn");
                setHasUserClickedStart(true);
              }}
              loadingText="Loading the application"
            >
              Start Labelling!
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
