import { ReactNode } from "react";
import { Flex, useColorModeValue as mode } from "@chakra-ui/react";
import { TopBar } from "./top-bar";

export type Props = {
  breadcrumbs?: ReactNode;
  topBarRightContent?: ReactNode;
  children: ReactNode;
  tabBar?: ReactNode;
};

export const Layout = ({
  children,
  breadcrumbs,
  topBarRightContent,
  tabBar,
}: Props) => {
  return (
    <Flex grow={1} direction="column">
      <TopBar breadcrumbs={breadcrumbs} rightContent={topBarRightContent} />
      {tabBar}
      <Flex
        grow={1}
        direction="column"
        as="main"
        bg={mode("gray.100", "gray.900")}
      >
        {children}
      </Flex>
    </Flex>
  );
};
