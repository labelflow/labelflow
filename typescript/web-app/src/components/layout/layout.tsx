import { ReactNode } from "react";
import { Flex, Box } from "@chakra-ui/react";
import { TopBar } from "./top-bar";

export type Props = {
  topBarLeftContent?: ReactNode;
  children: ReactNode;
};

export const Layout = ({ children, topBarLeftContent }: Props) => {
  return (
    <Flex direction="column" h="100vh">
      <TopBar leftContent={topBarLeftContent} />
      <Box as="main" bg="gray.100" flex="1">
        {children}
      </Box>
    </Flex>
  );
};
