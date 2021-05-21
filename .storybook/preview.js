import { addDecorator } from "@storybook/react";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "./../theme";

addDecorator((storyFn) => (
  <ChakraProvider theme={theme} resetCSS>
    {storyFn()}
  </ChakraProvider>
));
