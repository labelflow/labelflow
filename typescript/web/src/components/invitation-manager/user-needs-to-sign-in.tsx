import { useRouter } from "next/router";
import { Center, chakra, Button } from "@chakra-ui/react";
import { useQueryParam } from "use-query-params";
import { BoolParam } from "../../utils/query-param-bool";

export const UserNeedsToSignIn = () => {
  const router = useRouter();
  const [, setIsSigninOpen] = useQueryParam("modal-signin", BoolParam);

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
          You need to sign in to continue
        </chakra.header>
        <chakra.div flex={1} px={6} py={2}>
          You need to be signed in to accept an invitation. If you don&apos;t
          have an account already, you can create one.
        </chakra.div>

        <chakra.footer
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
          px={6}
          py={4}
        >
          <Button autoFocus ml={3} onClick={() => router.push("/")}>
            Continue to Home Page
          </Button>
          <Button
            autoFocus
            colorScheme="brand"
            ml={3}
            onClick={() => setIsSigninOpen(true, "replaceIn")}
          >
            Sign In
          </Button>
        </chakra.footer>
      </chakra.div>
    </Center>
  );
};
