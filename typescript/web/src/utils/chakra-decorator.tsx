import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../theme";

export const chakraDecorator = (storyFn: any) => (
  <ChakraProvider theme={theme} resetCSS>
    {storyFn()}
  </ChakraProvider>
);
