import React, { useCallback, useState } from "react";
import { useApolloClient, useQuery } from "@apollo/client";
import {
  Heading,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Text,
  Skeleton,
  ModalBody,
  useColorModeValue,
  ModalCloseButton,
  Box,
  Button,
  Flex,
  SimpleGrid,
  useColorModeValue as mode,
} from "@chakra-ui/react";

import { FaFacebook, FaGoogle } from "react-icons/fa";

import { DividerWithText } from "./divider-with-text";
import { Logo } from "../../logo";
import { SigupForm } from "./signin-form";

import { useRouter } from "next/router";

const Feature = (props: StackProps) => {
  const { title, children } = props;
  return (
    <Stack>
      <Text fontWeight="bold">{title}</Text>
      <Text>{children}</Text>
    </Stack>
  );
};

export const SigninModal = ({
  isOpen = false,
  onClose = () => {},
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) => {
  const router = useRouter();
  const client = useApolloClient();

  return (
    <Modal
      scrollBehavior="inside"
      isOpen={isOpen}
      size="3xl"
      onClose={onClose}
      isCentered
    >
      <ModalOverlay />
      <ModalContent height="auto">
        <ModalBody
          display="flex"
          p={{ base: "4", lg: "6" }}
          flexDirection="column"
        >
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing="14">
            <Flex
              direction="column"
              pt="18"
              display={{ base: "none", lg: "flex" }}
            >
              <Box mb="8" textAlign={{ base: "center", lg: "start" }}>
                <Heading size="lg" mb="2" fontWeight="extrabold">
                  Build the future of AI
                </Heading>
                {/* <Text
                  fontSize="lg"
                  color={mode("gray.600", "gray.400")}
                  fontWeight="medium"
                >
                  with your team.
                </Text> */}
              </Box>
              <SimpleGrid
                rounded="lg"
                mt="10"
                p={{ base: "10", lg: "0" }}
                columns={1}
                spacing="6"
                bg={{ base: mode("gray.200", "gray.700"), lg: "unset" }}
              >
                <Feature title="Collaborate Easily">
                  Invite your teammates to work together on datasets and share
                  your results.
                </Feature>
                <Feature title="Label Faster (soon)">
                  Use smart tools based on AI to label your data faster and more
                  precisely.
                </Feature>
                <Feature title="Secure your Data">
                  Your data is stored securely on our servers, no worry about
                  your data integrity.
                </Feature>
              </SimpleGrid>
            </Flex>
            <Box w="full">
              <Logo
                h="6"
                mb={{ base: "16", lg: "10" }}
                iconColor="brand.600"
                mx={{ base: "auto", lg: "unset" }}
              />
              <Box mb="8" textAlign={{ base: "center", lg: "start" }}>
                <Heading size="lg" mb="2" fontWeight="extrabold">
                  Sign in to LabelFlow
                </Heading>
                <Text
                  fontSize="lg"
                  color={mode("gray.600", "gray.400")}
                  fontWeight="medium"
                >
                  Free account. No credit card required
                </Text>
              </Box>
              <Stack spacing="4">
                <Button
                  variant="outline"
                  leftIcon={<Box as={FaGoogle} color="red.500" />}
                >
                  Sign up with Google
                </Button>
                <Button
                  variant="outline"
                  leftIcon={
                    <Box
                      as={FaFacebook}
                      color={mode("facebook.500", "facebook.300")}
                    />
                  }
                >
                  Sign up with Facebook
                </Button>
              </Stack>

              <DividerWithText>or</DividerWithText>
              <SigupForm />
              <Text
                mb="8"
                textAlign={{ base: "center", lg: "start" }}
                mt="12"
                fontSize="xs"
                color={useColorModeValue("gray.600", "gray.400")}
              >
                By continuing, you agree to LabelFlow Terms of Service and
                Privacy Policy
              </Text>
            </Box>
          </SimpleGrid>
        </ModalBody>
        <ModalCloseButton />
      </ModalContent>
    </Modal>
  );
};
