import { Button } from "@chakra-ui/react";
import { InvitationContainer } from "./invitation-container";

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
    <InvitationContainer
      header={`Join ${workspaceName} as ${currentUserIdentifier}?`}
      details={`This invitation was sent to ${invitationEmailAddress}, by accepting it you will have access to every datasets in the workspace.`}
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
    </InvitationContainer>
  );
};
