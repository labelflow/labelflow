import { Center, chakra, useColorModeValue as mode } from "@chakra-ui/react";
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
      <chakra.div
        role="dialog"
        bg={mode("white", "gray.800")}
        borderRadius="md"
        boxShadow="lg"
        color="inherit"
        display="flex"
        flexDirection="column"
        maxW="2xl"
        my="3.75rem"
        outline={0}
        position="relative"
        width="100%"
      >
        <chakra.header
          fontSize="xl"
          fontWeight="semibold"
          px={6}
          py={4}
          flex={0}
        >
          {header}
        </chakra.header>
        <chakra.div flex={1} px={6} py={2}>
          {details}
        </chakra.div>
        <chakra.footer
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
          px={6}
          py={4}
        >
          {children}
        </chakra.footer>
      </chakra.div>
    </Center>
  );
};
