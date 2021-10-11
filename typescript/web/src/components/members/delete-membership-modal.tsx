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
import { useSession } from "next-auth/react";
import { Membership } from "./types";
import { getDisplayName } from "./user";
import { useRouter } from "next/router";

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
  const session = useSession({ required: false });
  const router = useRouter();
  if (membership == null) {
    return null;
  }
  const isRemovingCurrentUser = membership.user.id === session?.data?.user?.id;
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
            {isRemovingCurrentUser
              ? `Leave ${membership.workspace.name}?`
              : `Remove ${getDisplayName(membership.user)} from ${
                  membership.workspace.name
                }?`}
          </AlertDialogHeader>

          {isRemovingCurrentUser ? (
            <AlertDialogBody>
              What happens when you leave a workspace?
              <UnorderedList>
                <ListItem>
                  You will no longer be able to access the workspace.
                </ListItem>
                <ListItem>
                  Every dataset in the workspace will still be accessible to the
                  other workspace members.
                </ListItem>
              </UnorderedList>
            </AlertDialogBody>
          ) : (
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
          )}

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
                if (isRemovingCurrentUser) {
                  router.replace({ pathname: "/" });
                }
              }}
              aria-label="Confirm removing user"
              ml={3}
            >
              {isRemovingCurrentUser ? "Leave" : "Deactivate"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
