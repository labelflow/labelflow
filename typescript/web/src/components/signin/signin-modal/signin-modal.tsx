import React, { ReactNode } from "react";

import {
  Heading,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  Text,
  ModalBody,
  useColorModeValue,
  ModalCloseButton,
  Box,
  Button,
  Flex,
  FormControl,
  Input,
  SimpleGrid,
  useColorModeValue as mode,
} from "@chakra-ui/react";

import { RiMailSendLine } from "react-icons/ri";

import { signIn } from "next-auth/client";

import { FaGithub, FaGoogle } from "react-icons/fa";

import { DividerWithText } from "./divider-with-text";
import { Logo } from "../../logo";

const Feature = (props: { title: string; children: ReactNode }) => {
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
  error,
}: {
  isOpen?: boolean;
  onClose?: () => void;
  error?: string;
}) => {
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
                mt="8"
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
                  onClick={() => signIn("google")}
                  leftIcon={<Box as={FaGoogle} color="red.500" />}
                >
                  Sign up with Google
                </Button>
                <Button
                  variant="outline"
                  onClick={() => signIn("github")}
                  leftIcon={
                    <Box
                      as={FaGithub}
                      color={mode("github.500", "github.300")}
                    />
                  }
                >
                  Sign up with Github
                </Button>
              </Stack>

              <DividerWithText>Or</DividerWithText>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const email = (
                    (e.target as HTMLFormElement).elements.namedItem(
                      "email"
                    ) as HTMLInputElement
                  ).value;
                  signIn("email", { email });
                  // your submit logic here
                }}
              >
                <Stack spacing="4">
                  <FormControl id="email">
                    {/* <FormLabel mb={1}>Email</FormLabel> */}
                    <Input
                      type="email"
                      autoComplete="email"
                      placeholder="you@company.com"
                    />
                  </FormControl>
                  <Button
                    type="submit"
                    variant="outline"
                    leftIcon={<Box as={RiMailSendLine} color="brand.500" />}
                  >
                    Sign in with Email
                  </Button>
                </Stack>
              </form>
              {error ? (
                <Text
                  mb="8"
                  textAlign={{ base: "center", lg: "start" }}
                  mt="12"
                  fontSize="xs"
                  color={useColorModeValue("red.600", "red.400")}
                >
                  {error}
                </Text>
              ) : (
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
              )}
            </Box>
          </SimpleGrid>
        </ModalBody>
        <ModalCloseButton />
      </ModalContent>
    </Modal>
  );
};
