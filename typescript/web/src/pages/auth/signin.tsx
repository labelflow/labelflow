import { Flex, Heading, VStack, useColorModeValue } from "@chakra-ui/react";
import { isEmpty } from "lodash/fp";
import { OAuthProviderType } from "next-auth/providers/oauth-types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { StringParam, useQueryParam } from "use-query-params";
import { SignIn, SignInProps, SignInProvider } from "../../components/auth";
import { Meta } from "../../components/meta";

const useRedirectIfAuthenticated = (redirectUrl?: string) => {
  const { status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === "authenticated") {
      router.replace(redirectUrl || "/");
    }
  });
};

const MustLogInMessage = () => (
  <Heading as="h3" textAlign="center" fontSize="3xl">
    Please sign-in to continue
  </Heading>
);

type BodyProps = SignInProps & {
  redirectUrl?: string;
};

const Body = ({ redirectUrl, ...props }: BodyProps) => {
  return (
    <SignInProvider>
      <Flex
        direction="column"
        align="center"
        bg={useColorModeValue("gray.100", "gray.800")}
        flexGrow={1}
        justify="center"
      >
        <VStack
          mt={10}
          maxW="md"
          spacing={10}
          bg={useColorModeValue("white", "gray.700")}
          p="8"
          borderRadius="8"
        >
          {redirectUrl && <MustLogInMessage />}
          <SignIn {...props} />
        </VStack>
      </Flex>
    </SignInProvider>
  );
};

const SignInPage = (props: SignInProps) => {
  const [redirect] = useQueryParam("redirect", StringParam);
  const redirectUrl = redirect ?? undefined;
  const { status } = useSession();
  useRedirectIfAuthenticated(redirectUrl);
  return (
    <>
      <Meta title="LabelFlow | Sign in" />
      {status === "unauthenticated" && (
        <Body redirectUrl={redirectUrl} {...props} />
      )}
    </>
  );
};

const AUTH_METHODS_ENV_NAMES: Partial<Record<OAuthProviderType, string[]>> = {
  keycloak: ["KEYCLOAK_ID", "KEYCLOAK_SECRET", "KEYCLOAK_ISSUER"],
  google: ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"],
  github: ["GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET"],
  email: ["EMAIL_SERVER", "EMAIL_FROM"],
};

export const getServerSideProps = async (): Promise<{ props: SignInProps }> => {
  const methods = Object.entries(AUTH_METHODS_ENV_NAMES)
    .filter(([, envNames]) =>
      envNames.every((envName) => !isEmpty(process.env[envName]))
    )
    .map(([method]) => method as OAuthProviderType);
  return { props: { methods } };
};

export default SignInPage;
