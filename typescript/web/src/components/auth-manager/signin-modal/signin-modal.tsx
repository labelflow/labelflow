import {
  Box,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  SimpleGrid,
  Text,
  useColorModeValue as mode,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { Logo } from "../../logo";
import { DividerWithText } from "./divider-with-text";
import { EmailSignIn } from "./email-signin";
import { Features } from "./features";
import { OAuthSignIn } from "./oauth-signin";
import { SignInError } from "./signin-error";
import { useSignInModal } from "./signin-modal.context";

const BigLogo = () => (
  <Logo
    h="9"
    mb={{ base: "16", lg: "10" }}
    iconColor="brand.600"
    mx={{ base: "auto", lg: "unset" }}
    visibility={{ base: "visible", lg: "hidden" }}
  />
);

const RightHeader = () => (
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
);

const Disclaimer = () => (
  <Text
    mb="8"
    textAlign={{ base: "center", lg: "start" }}
    mt="12"
    fontSize="xs"
    color={useColorModeValue("gray.600", "gray.400")}
  >
    By continuing, you agree to LabelFlow Terms of Service and Privacy Policy
  </Text>
);

const Status = () => {
  const { error } = useSignInModal();
  return error ? <SignInError /> : <Disclaimer />;
};

const RightBody = () => (
  <Box w="full">
    <BigLogo />
    <RightHeader />
    <OAuthSignIn />
    <DividerWithText>or sign in with email</DividerWithText>
    <EmailSignIn />
    <Status />
  </Box>
);

const SignInBody = () => (
  <ModalBody display="flex" p={{ base: "6", lg: "10" }} flexDirection="column">
    <SimpleGrid columns={{ base: 1, lg: 2 }} spacing="14">
      <Features />
      <RightBody />
    </SimpleGrid>
  </ModalBody>
);

const SignInContent = () => (
  <ModalContent height="auto">
    <SignInBody />
    <ModalCloseButton />
  </ModalContent>
);

export const SignInModal = () => {
  const { isOpen, close } = useSignInModal();
  return (
    <Modal
      scrollBehavior="inside"
      isOpen={isOpen}
      size="3xl"
      onClose={close}
      isCentered
    >
      <ModalOverlay />
      <SignInContent />
    </Modal>
  );
};
