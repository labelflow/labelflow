import { useRef } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  ListItem,
  UnorderedList,
} from "@chakra-ui/react";
import { Membership } from "./types";
import { getDisplayName } from "./user";

export const DeleteMembershipModal = ({
  isOpen = false,
  onClose = () => {},
  membership,
  deleteMembership,
}: {
  isOpen?: boolean;
  onClose?: () => void;
  membership: Membership | null;
  deleteMembership: (id: string) => void;
}) => {
  const cancelRef = useRef<HTMLButtonElement>(null);
  if (membership == null) {
    return null;
  }
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
            {`Remove ${getDisplayName(membership.user)} from ${
              membership.workspace.name
            }?`}
          </AlertDialogHeader>

          <AlertDialogBody>
            What happens when a user is removed?
            <UnorderedList>
              <ListItem>
                The member will no longer be able to access the workspace.
              </ListItem>
              <ListItem>
                The member&apos;s labels and files will still be accessible in
                LabelFlow.
              </ListItem>
            </UnorderedList>
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              onClick={onClose}
              aria-label="Cancel delete"
            >
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                deleteMembership(membership.id);
                onClose();
              }}
              aria-label="Confirm removing user"
              ml={3}
            >
              Deactivate
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
