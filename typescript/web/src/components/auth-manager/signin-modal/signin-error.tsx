import { Text, useColorModeValue } from "@chakra-ui/react";
import { isNil } from "lodash/fp";
import React from "react";
import { useSignInModal } from "./signin-modal.context";

const AUTHENTICATION_ERRORS = {
  Signin: "Try signing in with a different account.",
  OAuthSignin: "Try signing in with a different account.",
  OAuthCallback: "Try signing in with a different account.",
  OAuthCreateAccount: "Try signing in with a different account.",
  EmailCreateAccount: "Try signing in with a different account.",
  Callback: "Try signing in with a different account.",
  OAuthAccountNotLinked:
    "To confirm your identity, sign in with the same account you used originally.",
  EmailSignin: "Check your email inbox.",
  CredentialsSignin:
    "Sign in failed. Check the details you provided are correct.",
  default: "Unable to sign in.",
};

export const SignInError = () => {
  const { error } = useSignInModal();
  return (
    <Text
      mb="8"
      textAlign={{ base: "center", lg: "start" }}
      mt="12"
      fontSize="xs"
      color={useColorModeValue("red.600", "red.400")}
    >
      {!isNil(error) && error in AUTHENTICATION_ERRORS
        ? AUTHENTICATION_ERRORS[error as keyof typeof AUTHENTICATION_ERRORS]
        : AUTHENTICATION_ERRORS.default}
    </Text>
  );
};
