import { useRouter } from "next/router";
import { Button } from "@chakra-ui/react";
import { InvitationContainer } from "./invitation-container";

export const InvalidInvitation = ({ reason }: { reason: string }) => {
  const router = useRouter();

  return (
    <InvitationContainer header="This invitation is invalid" details={reason}>
      <Button
        autoFocus
        colorScheme="brand"
        ml={3}
        onClick={() => router.push("/")}
      >
        Continue to Home Page
      </Button>
    </InvitationContainer>
  );
};
