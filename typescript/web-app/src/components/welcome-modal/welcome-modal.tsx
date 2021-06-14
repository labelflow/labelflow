import React from "react";
import NextLink from "next/link";
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
import { Logo } from "../logo";

export const WelcomeModal = () => {
  const isOpen = true;

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
            spacing="4"
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

            <NextLink href="/images?modal-import">
              <Button
                size="lg"
                minW="210px"
                colorScheme="brand"
                height="14"
                px="8"
              >
                Start Labelling!
              </Button>
            </NextLink>

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
