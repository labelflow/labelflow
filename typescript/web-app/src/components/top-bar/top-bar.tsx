import { Flex } from "@chakra-ui/react";
import { Logo } from "../logo";

export const TopBar = () => {
  return (
    <Flex as="header" alignItems="center" bg="white" p="4" h="64px">
      <Logo h="26px" />
    </Flex>
  );
};
