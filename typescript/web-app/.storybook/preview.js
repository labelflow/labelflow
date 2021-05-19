import { addDecorator } from "@storybook/react";
import { ChakraProvider, ThemeProvider, theme } from "@chakra-ui/react";

addDecorator(storyFn => (<ChakraProvider>
    <ThemeProvider theme={theme}>
        {storyFn()}
    </ThemeProvider>
</ChakraProvider>))