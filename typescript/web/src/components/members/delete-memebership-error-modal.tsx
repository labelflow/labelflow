import { useRef } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { Membership } from "./types";
import { getDisplayName } from "./user";

export const DeleteMembershipErrorModal = ({
  isOpen = false,
  onClose = () => {},
  membership,
}: {
  isOpen?: boolean;
  onClose?: () => void;
  membership: Membership | null;
}) => {
  const cancelRef = useRef<HTMLButtonElement>(null);
  if (membership == null) {
    return null;
  }
  const displayName = getDisplayName(membership.user);
  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>
            {`Cannot remove owner ${displayName} from ${membership.workspace.name}`}
          </AlertDialogHeader>

          <AlertDialogBody>
            {`Set another member in the workspace with the role Owner before
            removing ${displayName}.`}
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button
              onClick={() => {
                onClose();
              }}
              aria-label="Accept delete membership error"
              ml={3}
            >
              Ok
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
