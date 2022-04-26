import { ReactNode } from "react";
import { Flex, useColorModeValue } from "@chakra-ui/react";
import { TopBar } from "./top-bar";

export type LayoutProps = {
  breadcrumbs?: ReactNode;
  topBarRightContent?: ReactNode;
  children: ReactNode;
  tabBar?: ReactNode;
  fullHeight?: boolean;
};

export const Layout = ({
  children,
  breadcrumbs,
  topBarRightContent,
  tabBar,
  fullHeight,
}: LayoutProps) => (
  <Flex grow={1} direction="column" minH="0">
    <TopBar breadcrumbs={breadcrumbs} rightContent={topBarRightContent} />
    {tabBar}
    <Flex
      grow={1}
      direction="column"
      as="main"
      bg={useColorModeValue("gray.100", "gray.900")}
      minHeight={fullHeight ? "0" : undefined}
    >
      {children}
    </Flex>
  </Flex>
);
