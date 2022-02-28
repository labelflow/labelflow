import { Button } from "@chakra-ui/react";
import NextLink from "next/link";
import { InvitationContainer } from "./invitation-container";

const GoHomeButton = () => (
  <NextLink href="/">
    <Button autoFocus colorScheme="brand" ml={3}>
      Continue to Home Page
    </Button>
  </NextLink>
);

export const InvalidInvitation = ({ reason }: { reason: string }) => (
  <InvitationContainer header="This invitation is invalid" details={reason}>
    <GoHomeButton />
  </InvitationContainer>
);
