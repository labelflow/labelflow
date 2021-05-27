import { PropsWithChildren } from "react";
import { ChakraProvider, Flex, Box } from "@chakra-ui/react";

import { theme } from "../../theme";
import { TopBar } from "../top-bar";

export const Layout = ({ children }: PropsWithChildren<{}>) => {
  return (
    <ChakraProvider theme={theme} resetCSS>
      <Flex direction="column" h="100vh">
        <TopBar />
        <Box as="main" bg="gray.100" flex="1">
          {children}
        </Box>
      </Flex>
    </ChakraProvider>
  );
};
