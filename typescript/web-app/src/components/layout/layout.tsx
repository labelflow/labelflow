import { ReactNode } from "react";
import { Flex, Box } from "@chakra-ui/react";
import { TopBar } from "./top-bar";
import { TabBar, TabBarItem } from "./tab-bar";

export type Props = {
  topBarLeftContent?: ReactNode;
  topBarRightContent?: ReactNode;
  children: ReactNode;
  tabs?: Array<TabBarItem>;
};

export const Layout = ({
  children,
  topBarLeftContent,
  topBarRightContent,
  tabs,
}: Props) => {
  return (
    <Flex direction="column" h="100vh">
      <TopBar
        leftContent={topBarLeftContent}
        rightContent={topBarRightContent}
      />
      {tabs && <TabBar tabs={tabs} />}
      <Box as="main" bg="gray.100" flex="1">
        {children}
      </Box>
    </Flex>
  );
};
