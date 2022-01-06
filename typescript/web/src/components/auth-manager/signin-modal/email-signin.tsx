import { Box, Button, FormControl, Input, Stack, Text } from "@chakra-ui/react";
import { isEmpty } from "lodash/fp";
import React, { ChangeEvent, useCallback } from "react";
import { RiMailSendLine } from "react-icons/ri";
import { useSignInModal } from "./signin-modal.context";

const LinkSent = () => {
  const { linkSent } = useSignInModal();
  return (
    <>
      <Text fontWeight="bold">Awaiting Confirmation</Text>
      <Text fontSize="sm">{`We've just sent an email to ${linkSent} with password-less sign-in link`}</Text>
    </>
  );
};

const EmailInput = () => {
  const { email, setEmail, validEmail } = useSignInModal();
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      setEmail(event.currentTarget.value),
    [setEmail]
  );
  const isInvalid = !isEmpty(email) && !validEmail;
  return (
    <Input
      focusBorderColor={isInvalid ? "red.500" : undefined}
      type="email"
      autoComplete="email"
      placeholder="you@company.com"
      value={email}
      onChange={handleChange}
    />
  );
};

const EmailSubmitButton = () => {
  const { sendingLink, validEmail } = useSignInModal();
  return (
    <Button
      type="submit"
      variant="outline"
      isDisabled={!validEmail}
      leftIcon={<Box as={RiMailSendLine} color="brand.500" />}
      isLoading={!isEmpty(sendingLink)}
      loadingText="Submitting"
    >
      Sign in with Email
    </Button>
  );
};

const EmailFormControls = () => {
  const { validEmail } = useSignInModal();
  return (
    <>
      <FormControl id="email" isRequired isInvalid={validEmail}>
        <EmailInput />
      </FormControl>
      <EmailSubmitButton />
    </>
  );
};

const EmailFormBody = () => {
  const { linkSent } = useSignInModal();
  return (
    <Stack spacing="4" h="24">
      {linkSent ? <LinkSent /> : <EmailFormControls />}
    </Stack>
  );
};

export const EmailSignIn = () => {
  const { signIn, setSendingLink } = useSignInModal();
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const email = (
          event.currentTarget.elements.namedItem("email") as HTMLInputElement
        ).value;
        setSendingLink(email);
        signIn("email", { email });
      }}
    >
      <EmailFormBody />
    </form>
  );
};
