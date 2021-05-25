import { PropsWithChildren } from "react";
import { ChakraProvider, Grid, GridItem, Box } from "@chakra-ui/react";

import { theme } from "../../../theme";
import Logo from "../../../../web-site/public/Logo.svg";
import { TopBar } from "../top-bar";

export const Layout = ({ children }: PropsWithChildren<{}>) => {
  return (
    <ChakraProvider theme={theme} resetCSS>
      <Grid h="100vh" templateColumns="1fr" templateRows="64px 1fr">
        <GridItem bg="white">
          <TopBar />
        </GridItem>
        <GridItem bg="gray.100">
          <Box as="main">{children}</Box>
        </GridItem>
      </Grid>
    </ChakraProvider>
  );
};
