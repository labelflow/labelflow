import {
  Center,
  Flex,
  Heading,
  useColorModeValue as mode,
  VStack,
  Text,
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
  <Center h="full">
    <VStack
      role="dialog"
      p={6}
      spacing={6}
      align="start"
      bg={mode("white", "gray.800")}
      borderRadius="md"
      boxShadow="lg"
      maxW="2xl"
      my="3.75rem"
      w="full"
    >
      <Heading fontSize="xl" fontWeight="semibold">
        {header}
      </Heading>
      <Text>{details}</Text>
      <Flex alignSelf="stretch" justify="flex-end">
        {children}
      </Flex>
    </VStack>
  </Center>
);
