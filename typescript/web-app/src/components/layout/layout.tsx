import { PropsWithChildren } from "react";
import { ChakraProvider, Grid, GridItem, Box } from "@chakra-ui/react";

import { theme } from "../../../theme";
import { TopBar } from "../top-bar";

export const Layout = ({ children }: PropsWithChildren<{}>) => {
  return (
    <ChakraProvider theme={theme} resetCSS>
      <Grid h="100vh" templateColumns="1fr" templateRows="64px 1fr">
        <GridItem>
          <TopBar />
        </GridItem>
        <GridItem>
          <Box as="main" bg="gray.100">
            {children}
          </Box>
        </GridItem>
      </Grid>
    </ChakraProvider>
  );
};
