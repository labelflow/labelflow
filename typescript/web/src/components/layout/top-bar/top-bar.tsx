import { ApolloProvider } from "@apollo/client";
import { HStack, Spacer } from "@chakra-ui/react";
import { ReactNode } from "react";
import { distantDatabaseClient } from "../../../connectors/apollo-client/client";
import { ResponsiveBreadcrumbs } from "./breadcrumbs";
import { HelpMenu } from "./help-menu";
import { UserMenu } from "./user-menu";

export type Props = {
  breadcrumbs?: ReactNode;
  rightContent?: ReactNode;
};

export const TopBar = ({ breadcrumbs, rightContent }: Props) => (
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
      {rightContent}
      <HelpMenu />
      <UserMenu />
    </HStack>
  </ApolloProvider>
);
