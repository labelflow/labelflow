import { Button, Center, chakra } from "@chakra-ui/react";

export const AcceptOrDeclineMembershipInvitation = ({
  accept,
  currentUserIdentifier,
  decline,
  invitationEmailAddress,
  workspaceName,
  disabled = false,
}: {
  accept: () => void;
  currentUserIdentifier: string;
  decline: () => void;
  invitationEmailAddress: string;
  workspaceName: string;
  disabled: boolean;
}) => {
  return (
    <>
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
            Join {workspaceName} as {currentUserIdentifier}?
          </chakra.header>
          <chakra.div flex={1} px={6} py={2}>
            This invitation was sent to {invitationEmailAddress}, by accepting
            it you will have access to every datasets in the workspace.
          </chakra.div>

          <chakra.footer
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
            px={6}
            py={4}
          >
            <Button
              aria-label="Decline invitation"
              disabled={disabled}
              onClick={decline}
            >
              Decline
            </Button>
            <Button
              aria-label="Accept invitation"
              autoFocus
              disabled={disabled}
              colorScheme="brand"
              ml={3}
              onClick={accept}
            >
              Accept
            </Button>
          </chakra.footer>
        </chakra.div>
      </Center>
    </>
  );
};
