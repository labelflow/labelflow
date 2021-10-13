import { ReactNode } from "react";
import { HStack, Spacer } from "@chakra-ui/react";
import { ApolloProvider } from "@apollo/client";
import { useSession } from "next-auth/react";

import { SigninButton } from "../../auth-manager/signin-button";
import {
  serviceWorkerClient,
  distantDatabaseClient,
} from "../../../connectors/apollo-client/client";

import { HelpMenu } from "./help-menu";
import { UserMenu } from "./user-menu";
import { ResponsiveBreadcrumbs } from "./breadcrumbs";

export type Props = {
  breadcrumbs?: ReactNode;
  rightContent?: ReactNode;
};

export const TopBar = ({ breadcrumbs, rightContent }: Props) => {
  const { status } = useSession({ required: false });

  const client = globalThis?.location?.pathname?.startsWith("/local")
    ? serviceWorkerClient
    : distantDatabaseClient;

  return (
    <ApolloProvider client={distantDatabaseClient}>
      <HStack
        as="header"
        alignItems="center"
        padding={4}
        spacing={4}
        h="64px"
        flex={0}
      >
        <ResponsiveBreadcrumbs>{breadcrumbs}</ResponsiveBreadcrumbs>
        <Spacer minWidth="6" />
        <ApolloProvider client={client}>{rightContent}</ApolloProvider>
        <HelpMenu />
        {process.env.NEXT_PUBLIC_FEATURE_SIGNIN === "true" &&
          status === "unauthenticated" && <SigninButton />}
        <UserMenu />
      </HStack>
    </ApolloProvider>
  );
};
