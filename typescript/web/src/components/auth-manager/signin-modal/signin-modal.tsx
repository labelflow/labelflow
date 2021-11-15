import React, { useCallback, useState } from "react";

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
  FormControl,
  Input,
  SimpleGrid,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { RiMailSendLine } from "react-icons/ri";
import { signIn } from "next-auth/react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { DividerWithText } from "./divider-with-text";
import { Logo } from "../../logo";
import { Features } from "./features";
import { validateEmail } from "../../../utils/validate-email";

const errors = {
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

export const SigninModal = ({
  isOpen = false,
  onClose = () => {},
  setIsOpen,
  error,
  setError,
  linkSent,
  setLinkSent,
}: {
  isOpen?: boolean;
  onClose?: () => void;
  setIsOpen: (isOpen: boolean) => void;
  error?: string | null;
  setError: (error: string) => void;
  linkSent?: string | null;
  setLinkSent: (email: string) => void;
}) => {
  const [sendingLink, setSendingLink] = useState(false);
  const [isEmailInvalid, setIsEmailInvalid] =
    useState<boolean | undefined>(undefined);

  const performSignIn = useCallback(
    async (method, options = {}) => {
      const signInResult = await signIn<"email" | "credentials">(method, {
        redirect: false,
        callbackUrl: window.location.toString().replace("modal-signin", ""),
        ...options,
      });
      if (signInResult?.error) {
        setError(signInResult.error);
      } else if (signInResult?.ok) {
        if (method === "email") {
          setLinkSent(options?.email);
          setSendingLink(false);
        } else {
          setIsOpen(false);
        }
      }
    },
    [setIsOpen, setError, setLinkSent, setSendingLink]
  );

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
          p={{ base: "6", lg: "10" }}
          flexDirection="column"
        >
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing="14">
            <Features />
            <Box w="full">
              <Logo
                h="9"
                mb={{ base: "16", lg: "10" }}
                iconColor="brand.600"
                mx={{ base: "auto", lg: "unset" }}
                visibility={{ base: "visible", lg: "hidden" }}
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
                  onClick={() => performSignIn("google")}
                  leftIcon={<Box as={FaGoogle} color="red.500" />}
                >
                  Sign in with Google
                </Button>
                <Button
                  variant="outline"
                  onClick={() => performSignIn("github")}
                  leftIcon={
                    <Box
                      as={FaGithub}
                      color={mode("github.500", "github.300")}
                    />
                  }
                >
                  Sign in with GitHub
                </Button>
              </Stack>

              <DividerWithText>or sign in with email</DividerWithText>
              <form
                css={{
                  ":invalid": { button: { color: "red" } },
                }}
                onSubmit={(e) => {
                  e.preventDefault();
                  const email = (
                    (e.target as HTMLFormElement).elements.namedItem(
                      "email"
                    ) as HTMLInputElement
                  ).value;
                  performSignIn("email", {
                    email,
                  });
                  setSendingLink(true);
                }}
              >
                <Stack spacing="4" h="24">
                  {linkSent ? (
                    <>
                      <Text fontWeight="bold">Awaiting Confirmation</Text>
                      <Text fontSize="sm">{`We just sent an email to ${linkSent} with password-less sign-in link`}</Text>
                    </>
                  ) : (
                    <>
                      <FormControl
                        id="email"
                        isRequired
                        isInvalid={isEmailInvalid}
                      >
                        <Input
                          onChange={(event) => {
                            setIsEmailInvalid(
                              !validateEmail(event.target.value)
                            );
                          }}
                          onBlur={(event) => {
                            if (event.target.value.length === 0) {
                              setIsEmailInvalid(undefined);
                            }
                          }}
                          focusBorderColor={
                            isEmailInvalid ? "red.500" : undefined
                          }
                          type="email"
                          autoComplete="email"
                          placeholder="you@company.com"
                        />
                      </FormControl>
                      <Button
                        type="submit"
                        variant="outline"
                        isDisabled={isEmailInvalid ?? true}
                        leftIcon={<Box as={RiMailSendLine} color="brand.500" />}
                        isLoading={sendingLink}
                        loadingText="Submitting"
                      >
                        Sign in with Email
                      </Button>
                    </>
                  )}
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
                  {error in errors
                    ? errors[error as keyof typeof errors]
                    : errors.default}
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
