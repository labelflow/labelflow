import { Box,Heading,Text, VStack } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useCallback, useEffect } from "react";
import { StringParam, useQueryParam } from "use-query-params";
import { SignIn, SignInProvider } from "../../components/auth";
import { CookieBanner } from "../../components/cookie-banner";
import { Layout } from "../../components/layout";
import { NavLogo } from "../../components/logo/nav-logo";
import { Meta } from "../../components/meta";
import { LayoutSpinner } from "../../components/spinner";

const useRedirectIfAuthenticated = (redirectUrl?: string) => {
  const { status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === "authenticated") {
      router.replace(redirectUrl || `/`);
    }
  });
};

const MustLogInMessage = () => (<Heading as="h3">Please sign-in to continue</Heading>)

type BodyProps = {
  redirectUrl?: string;
};

const Body = ({ redirectUrl }: BodyProps) => {
  return (
    <SignInProvider>
      <VStack mt="3em" mx="auto" maxW={"4xl"} spacing="3em">
        {redirectUrl && <MustLogInMessage />}
        <SignIn />
      </VStack>
    </SignInProvider>
  );
};

const SignInPage = () => {
  const [redirect] = useQueryParam("redirect", StringParam);
  const redirectUrl = redirect ?? undefined
  const { status } = useSession();
  useRedirectIfAuthenticated(redirectUrl);
  return (
    <>
      <Meta title="LabelFlow | Sign in" />
      {status !== "unauthenticated" ? null : <Body redirectUrl={redirectUrl} />}
    </>
  );
};

export default SignInPage;
