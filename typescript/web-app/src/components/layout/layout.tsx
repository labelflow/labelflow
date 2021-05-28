import * as React from "react";
import { ChakraProvider, Flex, Box } from "@chakra-ui/react";

import { theme } from "../../theme";
import { TopBar } from "../top-bar";

export type Props = {
  topBarLeftContent?: React.ReactNode;
  children: React.ReactNode;
};

export const Layout = ({ children, topBarLeftContent }: Props) => {
  return (
    <ChakraProvider theme={theme} resetCSS>
      <Flex direction="column" h="100vh">
        <TopBar leftContent={topBarLeftContent} />
        <Box as="main" bg="gray.100" flex="1" position="relative">
          {children}
        </Box>
      </Flex>
    </ChakraProvider>
  );
};
