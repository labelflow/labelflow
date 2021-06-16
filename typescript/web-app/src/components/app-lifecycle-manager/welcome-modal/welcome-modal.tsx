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
import { useQueryParam } from "use-query-params";

import { Logo } from "../../logo";
import { BoolParam } from "../../../utils/query-param-bool";

export const WelcomeModal = ({
  isServiceWorkerActive,
}: {
  isServiceWorkerActive: boolean;
}) => {
  // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Welcome-wizard
  const [isDisabled] = useQueryParam("modal-welcome-disable", BoolParam);
  const [hasUserClickedStart, setHasUserClickedStart] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // This modal should open when isServiceWorkerActive becomes false
  // But close only when the use hasUserClickedStart becomes true
  useEffect(() => {
    if (!isServiceWorkerActive && !hasUserClickedStart && !isDisabled) {
      setIsOpen(true);
      return;
    }
    if (isServiceWorkerActive && hasUserClickedStart) {
      setIsOpen(false);
    }
    // In the 2 other cases, we do nothing, this is an hysteresis
    // To "latch" the modal to open once it opened once
  }, [isServiceWorkerActive, hasUserClickedStart]);

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
              // letterSpacing="tight"
              textAlign="center"
              // textAlign="justify"
            >
              The open standard{" "}
              <Text
                color="brand.500"
                // bgGradient="linear(to-l, brand.500,brand.400)"
                // bgClip="text"
                display="inline"
              >
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
            {/* <InitialSetup /> */}
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

            {/* <NextLink href="/images?modal-import"> */}
            <Button
              size="lg"
              minW="210px"
              colorScheme="brand"
              height="14"
              px="8"
              isLoading={hasUserClickedStart && !isServiceWorkerActive}
              onClick={() => setHasUserClickedStart(true)}
              loadingText="Loading the application"
            >
              Start Labelling!
            </Button>
            {/* </NextLink> */}

            {/* <Button
                size="lg"
                bg="white"
                color="gray.900"
                _hover={{ bg: "gray.50" }}
                height="14"
                px="8"
                shadow="base"
                leftIcon={<Box as={HiPlay} fontSize="2xl" />}
              >
                Watch Demo
              </Button> */}
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
