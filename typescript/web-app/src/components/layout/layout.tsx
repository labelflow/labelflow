import { ReactNode } from "react";
import { ChakraProvider, Flex, Box } from "@chakra-ui/react";

import { theme } from "../../theme";
import { TopBar } from "../top-bar";

export type Props = {
  topBarLeftContent?: ReactNode;
  children: ReactNode;
};

export const Layout = ({ children, topBarLeftContent }: Props) => {
  return (
    <ChakraProvider theme={theme} resetCSS>
      <Flex direction="column" h="100vh">
        <TopBar leftContent={topBarLeftContent} />
        <Box
          as="main"
          bg="gray.100"
          flex="1"
          // Position relative to allow children to use `height: 100%` if they want to take the whole height
          // E.g. Openlayers uses `height: 100%` to have the right size. without this, openlayers would have
          // the same height as the screen, and be too big, this would allow the user to scroll down weirdly.
          position="relative"
        >
          {children}
        </Box>
      </Flex>
    </ChakraProvider>
  );
};
