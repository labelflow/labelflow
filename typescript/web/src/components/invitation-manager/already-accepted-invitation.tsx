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

export const AlreadyAcceptedInvitation = ({
  userInMembershipEmailAddress,
}: {
  userInMembershipEmailAddress: string;
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
          This invitation was already accepted by {userInMembershipEmailAddress}
        </AlertDialogHeader>
        <AlertDialogBody>
          If you cannot access the workspace, try again after signing-in as{" "}
          {userInMembershipEmailAddress}.
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
