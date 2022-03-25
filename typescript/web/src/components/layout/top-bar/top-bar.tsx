import { ApolloProvider } from "@apollo/client";
import { HStack, Spacer } from "@chakra-ui/react";
import { ReactNode } from "react";
import { distantDatabaseClient } from "../../../connectors/apollo-client/client";
import {
  ANNOUNCEKIT_WARNING_URL,
  Announcements,
  AnnouncementsButton,
} from "../../announcements";
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

export const TopBar = ({ breadcrumbs, rightContent }: TopBarProps) => (
  <ApolloProvider client={distantDatabaseClient}>
    <HStack
      as="header"
      alignItems="center"
      padding="6px 16px"
      spacing={4}
      h="56px"
      flex={0}
    >
      <ResponsiveBreadcrumbs>{breadcrumbs}</ResponsiveBreadcrumbs>
      <Spacer minWidth="6" />
      {rightContent}
      <TopBarAnnouncements />
      <HelpMenu />
      <UserMenu />
    </HStack>
  </ApolloProvider>
);
