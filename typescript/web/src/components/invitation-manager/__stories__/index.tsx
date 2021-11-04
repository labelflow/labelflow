import React from "react";
import { chakraDecorator } from "../../../utils/chakra-decorator";
import { apolloDecorator } from "../../../utils/apollo-decorator";
import { queryParamsDecorator } from "../../../utils/query-params-decorator";

import { AcceptOrDeclineMembershipInvitation } from "../accept-or-decline-membership-invitation";
import { InvalidInvitation as InvalidInvitationComponent } from "../invalid-invitation";
import { UserNeedsToSignIn as UserNeedsToSignInComponent } from "../user-needs-to-sign-in";

export default {
  title: "web/Invitation manager",
  decorators: [chakraDecorator, apolloDecorator, queryParamsDecorator],
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
