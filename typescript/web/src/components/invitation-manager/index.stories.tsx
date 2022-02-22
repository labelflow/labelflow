import { Flex } from "@chakra-ui/react";
import { Story } from "@storybook/react";
import React from "react";
import {
  apolloMockDecorator,
  chakraDecorator,
  queryParamsDecorator,
  storybookTitle,
} from "../../utils/stories";
import { AcceptOrDeclineMembershipInvitation } from "./accept-or-decline-membership-invitation";
import { InvalidInvitation as InvalidInvitationComponent } from "./invalid-invitation";
import { UserNeedsToSignIn as UserNeedsToSignInComponent } from "./user-needs-to-sign-in";

const layoutDecorator = (StoryComponent: Story) => (
  <Flex grow={1} direction="column" as="main" bg="gray">
    <StoryComponent />
  </Flex>
);

export default {
  title: storybookTitle("Invitation manager"),
  decorators: [
    chakraDecorator,
    apolloMockDecorator,
    queryParamsDecorator,
    layoutDecorator,
  ],
};

export const AcceptOrDecline = () => (
  <AcceptOrDeclineMembershipInvitation
    accept={() => console.log("accept")}
    currentUserIdentifier="toto@sterblue.com"
    decline={() => console.log("decline")}
    invitationEmailAddress="toto@sterblue.com"
    workspaceName="Sterblue"
    disabled={false}
  />
);

export const InvalidInvitation = () => (
  <InvalidInvitationComponent reason="This is the reason" />
);

export const UserNeedsToSignIn = () => <UserNeedsToSignInComponent />;
