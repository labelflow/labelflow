import { useRouter } from "next/router";
import { Center, chakra, Button } from "@chakra-ui/react";

export const InvalidInvitation = ({ reason }: { reason: string }) => {
  const router = useRouter();

  return (
    <Center h="full">
      <chakra.div
        role="dialog"
        bg="white"
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
          This invitation is invalid
        </chakra.header>
        <chakra.div flex={1} px={6} py={2}>
          {reason}
        </chakra.div>

        <chakra.footer
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
          px={6}
          py={4}
        >
          <Button
            autoFocus
            colorScheme="brand"
            ml={3}
            onClick={() => router.push("/")}
          >
            Continue to Home Page
          </Button>
        </chakra.footer>
      </chakra.div>
    </Center>
  );
};
