import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../../theme";

export const chakraDecorator = (Story: any) => (
  <ChakraProvider theme={theme} resetCSS>
    <Story />
  </ChakraProvider>
);
