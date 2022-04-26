import { Flex, useColorModeValue } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { LayoutSpinner } from ".";
import { CYPRESS_SCREEN_HEIGHT } from "../../../utils/stories";

// We're forced to simulate the existing layout here since Layout has no tests
// at all and useSession does not seems to have been mocked somewhere yet
export const Wrapper = ({ children }: PropsWithChildren<{}>) => (
  <Flex
    direction="column"
    h={`${CYPRESS_SCREEN_HEIGHT}px`}
    as="main"
    bg={useColorModeValue("gray.100", "gray.900")}
  >
    {children}
  </Flex>
);

export const TestComponent = () => <LayoutSpinner data-testid="spinner" />;
