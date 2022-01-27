import React from "react";
import {
  apolloMockDecorator,
  chakraDecorator,
  queryParamsDecorator,
  storybookTitle,
} from "../../../utils/stories";
import { AcceptOrDeclineMembershipInvitation } from "../accept-or-decline-membership-invitation";
import { InvalidInvitation as InvalidInvitationComponent } from "../invalid-invitation";
import { UserNeedsToSignIn as UserNeedsToSignInComponent } from "../user-needs-to-sign-in";

export default {
  title: storybookTitle("Invitation manager"),
  decorators: [chakraDecorator, apolloMockDecorator, queryParamsDecorator],
};

export const AcceptOrDecline = () => (
  <div style={{ width: "100vw", height: "100vh", backgroundColor: "grey" }}>
    <AcceptOrDeclineMembershipInvitation
      accept={() => console.log("accept")}
      currentUserIdentifier="toto@sterblue.com"
      decline={() => console.log("decline")}
      invitationEmailAddress="toto@sterblue.com"
      workspaceName="Sterblue"
      disabled={false}
    />
  </div>
);

export const InvalidInvitation = () => (
  <div style={{ width: "100vw", height: "100vh", backgroundColor: "grey" }}>
    <InvalidInvitationComponent reason="This is the reason" />
  </div>
);

export const UserNeedsToSignIn = () => (
  <div style={{ width: "100vw", height: "100vh", backgroundColor: "grey" }}>
    <UserNeedsToSignInComponent />
  </div>
);
