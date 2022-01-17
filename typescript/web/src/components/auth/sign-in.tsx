import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  useColorModeValue as mode,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { Logo } from "../logo";
import { DividerWithText } from "./divider-with-text";
import { EmailSignIn } from "./email-sign-in";
import { Features } from "./features";
import { OAuthSignIn } from "./oauth-sign-in";
import { SignInError } from "./sign-in-error";
import { useSignIn } from "./sign-in.context";

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
  const { error } = useSignIn();
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

export const SignIn = () => (
  <SimpleGrid columns={{ base: 1, lg: 2 }} spacing="14">
    <Features />
    <RightBody />
  </SimpleGrid>
);
