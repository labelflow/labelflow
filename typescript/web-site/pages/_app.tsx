import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import { AppProps } from "next/app";

import { theme } from "../components/theme";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
