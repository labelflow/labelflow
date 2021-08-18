import { useState, useEffect, useCallback, useRef } from "react";

import {
  chakra,
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
import { RiGithubFill } from "react-icons/ri";
import { StringParam, useQueryParam } from "use-query-params";

import { Logo } from "../../logo";

import { ArtworkLaunching } from "./artwork-launching";

const GithubIcon = chakra(RiGithubFill);

export const WelcomeModal = ({
  isServiceWorkerActive,
  initiallyHasUserClickedStart = false,
}: {
  isServiceWorkerActive: boolean;
  initiallyHasUserClickedStart?: boolean;
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
  const [hasUserClickedStart, setHasUserClickedStart] = useState(
    initiallyHasUserClickedStart
  );
  const isOpen =
    (!isServiceWorkerActive && !(paramModalWelcome === "closed")) ||
    paramModalWelcome === "open";
  const setIsOpen = (value: boolean) =>
    setParamModalWelcome(value ? "open" : undefined, "replaceIn");

  const startLabellingButtonRef = useRef<HTMLButtonElement>(null);

  // This modal should open when isServiceWorkerActive becomes false
  // But close only when the use hasUserClickedStart becomes true
  useEffect(() => {
    if (isServiceWorkerActive && hasUserClickedStart) {
      setIsOpen(false);
      return;
    }
    if (
      (!isServiceWorkerActive &&
        !hasUserClickedStart &&
        !(paramModalWelcome === "closed")) ||
      paramModalWelcome === "open"
    ) {
      setIsOpen(true);
    }
    // In the 2 other cases, we do nothing, this is an hysteresis
    // To "latch" the modal to open once it opened once
  }, [isServiceWorkerActive, hasUserClickedStart, paramModalWelcome]);

  const handleClickStartLabelling = useCallback(() => {
    setHasUserClickedStart(true);
    // This is needed to fix a rare bug in which the welcome modal is stuck
    // in the "loading app" state when a new service worker is waiting AND
    // the welcome modal is open.
    // This never happens except in nominal user flows, but still
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      window.workbox !== undefined
    ) {
      const wb = window.workbox;
      // // This next 3 lines were removed because they caused a reload of the page
      // // when the user clicked "Start Labelling"
      // wb.addEventListener("controlling", (/* event: any */) => {
      //   window.location.reload();
      // });
      // Send a message to the waiting service worker, instructing it to activate.
      wb.messageSkipWaiting();
    }
  }, [setHasUserClickedStart, setParamModalWelcome]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}}
      size="3xl"
      scrollBehavior="inside"
      isCentered
      initialFocusRef={startLabellingButtonRef}
    >
      <ModalOverlay />
      <ModalContent margin="3.75rem">
        <ModalHeader textAlign="center" padding="6">
          <Center>
            <Logo maxW="lg" mt="8" mb="8" h="min-content" />
          </Center>
        </ModalHeader>

        {hasUserClickedStart && !isServiceWorkerActive ? (
          <ModalBody>
            {/* <VStack
              maxW="2xl"
              mx="auto"
              mt="0"
              mb="8"
              textAlign="center"
              spacing={4}
            >
              <Heading as="h2" maxW="lg">
                Please wait while the application finishes loading.
              </Heading>
              <Text mt="4" fontSize="lg" maxW="lg">
                This application runs completely offline, This allows you to
                have a lightning fast labelling tool even with no internet
                connection, and guarantees we don&apos;t use your data.
              </Text>
              <ArtworkLaunching width={200} height={200} />
            </VStack> */}
            <VStack
              justifyContent="space-evenly"
              spacing="8"
              h="full"
              mt="0"
              mb="8"
            >
              <Text
                color={mode("gray.600", "gray.400")}
                maxW="lg"
                fontSize="lg"
                fontWeight="medium"
                textAlign="justify"
              >
                Please wait while the application finishes loading. Labelflow
                runs completely offline, this allows you to have a lightning
                fast labelling tool even with no internet connection, and
                guarantees we don&apos;t use your data.
              </Text>
              <ArtworkLaunching />
            </VStack>
          </ModalBody>
        ) : (
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
                Stay in control of your data, label your images without them
                leaving your computer. Focus on building the next big thing.
              </Text>
            </VStack>
          </ModalBody>
        )}

        <ModalFooter>
          <HStack
            direction={{ base: "column", md: "row" }}
            justifyContent="center"
            width="full"
            spacing="4"
            mb="10"
          >
            <Button
              as="a"
              leftIcon={<GithubIcon fontSize="xl" />}
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
              ref={startLabellingButtonRef}
              size="lg"
              minW="210px"
              colorScheme="brand"
              height="14"
              px="8"
              isLoading={hasUserClickedStart && !isServiceWorkerActive}
              onClick={handleClickStartLabelling}
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
