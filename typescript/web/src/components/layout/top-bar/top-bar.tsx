import { ApolloProvider } from "@apollo/client";
import { HStack, Spacer } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { ReactNode } from "react";
import {
  distantDatabaseClient,
  serviceWorkerClient,
} from "../../../connectors/apollo-client/client";
import {
  ANNOUNCEKIT_WARNING_URL,
  Announcements,
  AnnouncementsButton,
} from "../../announcements";
import { SigninButton } from "../../auth-manager/signin-button";
import { ResponsiveBreadcrumbs } from "./breadcrumbs";
import { HelpMenu } from "./help-menu";
import { UserMenu } from "./user-menu";

const TopBarAnnouncements = () => (
  <>
    <Announcements widget={ANNOUNCEKIT_WARNING_URL} labels={["warning"]} />
    <AnnouncementsButton boosters={false} />
  </>
);

export type TopBarProps = {
  breadcrumbs?: ReactNode;
  rightContent?: ReactNode;
};

export const TopBar = ({ breadcrumbs, rightContent }: TopBarProps) => {
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
        spacing={2}
        h="64px"
        flex={0}
      >
        <ResponsiveBreadcrumbs>{breadcrumbs}</ResponsiveBreadcrumbs>
        <Spacer minWidth="6" />
        <ApolloProvider client={client}>{rightContent}</ApolloProvider>
        <TopBarAnnouncements />
        <HelpMenu />
        {status === "unauthenticated" && <SigninButton />}
        <UserMenu />
      </HStack>
    </ApolloProvider>
  );
};
