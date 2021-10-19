import { useRef } from "react";
import { useRouter } from "next/router";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogBody,
  AlertDialogHeader,
  Button,
} from "@chakra-ui/react";

const noOp = () => {};

export const RevokedInvitation = ({
  invitationEmailAddress,
}: {
  invitationEmailAddress: string;
}) => {
  const goHomeRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  return (
    <AlertDialog
      size="2xl"
      motionPreset="none"
      leastDestructiveRef={goHomeRef}
      onClose={noOp}
      isOpen
      isCentered
      closeOnEsc={false}
    >
      <AlertDialogContent boxShadow="none">
        <AlertDialogHeader>
          This invitation to {invitationEmailAddress} has been revoked
        </AlertDialogHeader>
        <AlertDialogBody>
          Contact directly the workspace owner to be reinvited.
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button
            ref={goHomeRef}
            colorScheme="brand"
            ml={3}
            onClick={() => router.push("/")}
          >
            Continue to Home Page
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
