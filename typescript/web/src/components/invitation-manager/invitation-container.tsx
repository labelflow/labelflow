import {
  Center,
  Flex,
  Heading,
  useColorModeValue as mode,
  VStack,
} from "@chakra-ui/react";
import { PropsWithChildren } from "react";

type InvitationContainerProps = {
  header: string;
  details: string;
};

type CompleteProps = PropsWithChildren<InvitationContainerProps>;

export const InvitationContainer = ({
  header,
  details,
  children,
}: CompleteProps) => {
  return (
    <Center h="full">
      <VStack
        p={6}
        spacing={6}
        align="start"
        bg={mode("white", "gray.800")}
        borderRadius="md"
        boxShadow="lg"
        maxW="2xl"
        my="3.75rem"
      >
        <Heading fontSize="xl" fontWeight="semibold">
          {header}
        </Heading>
        <Flex>{details}</Flex>
        <Flex w="100%" justify="flex-end">
          {children}
        </Flex>
      </VStack>
    </Center>
  );
};
