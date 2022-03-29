import {
  Flex,
  Heading,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { PropsWithChildren } from "react";

export type InvitationContainerProps = PropsWithChildren<{
  header: string;
  details: string;
}>;

export const InvitationContainer = ({
  header,
  details,
  children,
}: InvitationContainerProps) => (
  <Flex orientation="row" justify="center">
    <VStack
      flexGrow={1}
      role="dialog"
      p={6}
      spacing={6}
      bg={useColorModeValue("white", "gray.800")}
      borderRadius="md"
      boxShadow="lg"
      maxW="2xl"
      my="3.75rem"
      align="start"
    >
      <Heading fontSize="xl" fontWeight="semibold">
        {header}
      </Heading>
      <Text>{details}</Text>
      <Flex alignSelf="stretch" justify="flex-end">
        {children}
      </Flex>
    </VStack>
  </Flex>
);
