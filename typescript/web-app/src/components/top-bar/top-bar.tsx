import { Flex } from "@chakra-ui/react";
import { Logo } from "../logo";

import { ImportButton } from "./import-button";

export const TopBar = () => {
  return (
    <Flex as="header" alignItems="center" bg="white" p="4" h="64px">
      <Logo h="26px" />
      <ImportButton />
    </Flex>
  );
};
