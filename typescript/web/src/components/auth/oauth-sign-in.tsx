import { Box, Button, ButtonProps, Stack } from "@chakra-ui/react";
import { OAuthProviderType } from "next-auth/providers";
import React, { useCallback } from "react";
import { FaGithub, FaUserLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useSignIn } from "./sign-in.context";

type OAuthButtonProps = {
  provider: OAuthProviderType;
  icon: ButtonProps["leftIcon"];
  label: string;
};

const OAuthButton = ({ provider, label, icon }: OAuthButtonProps) => {
  const { signIn } = useSignIn();
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
  keycloak: {
    icon: <Box as={FaUserLock} />,
    label: "Sign in with Keycloak",
  },
  google: {
    icon: <Box as={FcGoogle} />,
    label: "Sign in with Google",
  },
  github: {
    icon: <Box as={FaGithub} />,
    label: "Sign in with GitHub",
  },
});

export type OAuthSignInProps = { methods: OAuthProviderType[] };

export const OAuthSignIn = ({ methods: enabledMethods }: OAuthSignInProps) => {
  const methods = useOAuthSignIn();
  return (
    <Stack spacing="4">
      {Object.entries(methods)
        .filter(([method]) =>
          enabledMethods.includes(method as OAuthProviderType)
        )
        .map(([provider, props]) => (
          <OAuthButton
            key={provider}
            provider={provider as OAuthProviderType}
            {...props}
          />
        ))}
    </Stack>
  );
};
