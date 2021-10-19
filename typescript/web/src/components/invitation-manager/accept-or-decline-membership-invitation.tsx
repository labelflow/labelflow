import { useCallback, useRef } from "react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogBody,
  AlertDialogHeader,
  Button,
} from "@chakra-ui/react";

const noOp = () => {};

export const AcceptOrDeclineMembershipInvitation = ({
  accept,
  currentUserIdentifier,
  decline,
  invitationEmailAddress,
  workspaceName,
}: {
  accept: () => void;
  currentUserIdentifier: string;
  decline: () => void;
  invitationEmailAddress: string;
  workspaceName: string;
}) => {
  const acceptRef = useRef<HTMLButtonElement>(null);

  return (
    <AlertDialog
      size="2xl"
      motionPreset="none"
      leastDestructiveRef={acceptRef}
      onClose={noOp}
      isOpen
      isCentered
      closeOnEsc={false}
    >
      <AlertDialogContent boxShadow="none">
        <AlertDialogHeader>
          Join {workspaceName} as {currentUserIdentifier}?
        </AlertDialogHeader>
        <AlertDialogBody>
          This invitation was sent to {invitationEmailAddress}, by accepting it
          you will have access to every datasets in the workspace.
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button onClick={decline}>Decline</Button>
          <Button ref={acceptRef} colorScheme="brand" ml={3} onClick={accept}>
            Accept
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
