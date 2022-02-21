import {
  Flex,
  Heading,
  VStack,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { StringParam, useQueryParam } from "use-query-params";
import { SignIn, SignInProvider } from "../../components/auth";
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
  <Heading as="h3">Please sign-in to continue</Heading>
);

type BodyProps = {
  redirectUrl?: string;
};

const Body = ({ redirectUrl }: BodyProps) => {
  return (
    <SignInProvider>
      <Flex
        direction="column"
        align="center"
        bg={mode("gray.100", "gray.800")}
        flexGrow={1}
        justify="center"
      >
        <VStack
          mt={10}
          maxW="md"
          spacing={10}
          bg={mode("white", "gray.700")}
          p="8"
          borderRadius="8"
        >
          {redirectUrl && <MustLogInMessage />}
          <SignIn />
        </VStack>
      </Flex>
    </SignInProvider>
  );
};

const SignInPage = () => {
  const [redirect] = useQueryParam("redirect", StringParam);
  const redirectUrl = redirect ?? undefined;
  const { status } = useSession();
  useRedirectIfAuthenticated(redirectUrl);
  return (
    <>
      <Meta title="LabelFlow | Sign in" />
      {status === "unauthenticated" && <Body redirectUrl={redirectUrl} />}
    </>
  );
};

export default SignInPage;
