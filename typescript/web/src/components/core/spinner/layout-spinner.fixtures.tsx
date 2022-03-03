import { Flex, Box, useColorModeValue as mode } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { LayoutSpinner } from ".";

// We're forced to simulate the existing layout here since Layout has no tests
// at all and useSession does not seems to have been mocked somewhere yet
export const Wrapper = ({ children }: PropsWithChildren<{}>) => (
  <Flex direction="column" h="100vh">
    <Box as="main" bg={mode("gray.100", "gray.900")} flex="1">
      {children}
    </Box>
  </Flex>
);

export const TestComponent = () => <LayoutSpinner data-testid="spinner" />;
