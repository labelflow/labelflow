import {
  Box,
  Button,
  ButtonProps,
  Stack,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { OAuthProviderType } from "next-auth/providers";
import React, { useCallback } from "react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { useSignInModal } from "./signin-modal.context";

type OAuthButtonProps = {
  provider: OAuthProviderType;
  icon: ButtonProps["leftIcon"];
  label: string;
};

const OAuthButton = ({ provider, label, icon }: OAuthButtonProps) => {
  const { signIn } = useSignInModal();
  const handleClick = useCallback(() => signIn(provider), [provider, signIn]);
  return (
    <Button variant="outline" onClick={handleClick} leftIcon={icon}>
      {label}
    </Button>
  );
};

const useOAuthSignIn = (): Partial<
  Record<OAuthProviderType, Omit<OAuthButtonProps, "provider">>
> => ({
  google: {
    icon: <Box as={FaGoogle} color="red.500" />,
    label: "Sign in with Google",
  },
  github: {
    icon: <Box as={FaGithub} color={mode("github.500", "github.300")} />,
    label: "Sign in with GitHub",
  },
});

export const OAuthSignIn = () => {
  const methods = useOAuthSignIn();
  return (
    <Stack spacing="4">
      {Object.entries(methods).map(([provider, props]) => (
        <OAuthButton
          key={provider}
          provider={provider as OAuthProviderType}
          {...props}
        />
      ))}
    </Stack>
  );
};
