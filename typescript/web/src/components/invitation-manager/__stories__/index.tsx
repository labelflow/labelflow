import React from "react";
import { chakraDecorator } from "../../../utils/chakra-decorator";
import { apolloDecorator } from "../../../utils/apollo-decorator";
import { queryParamsDecorator } from "../../../utils/query-params-decorator";

import { AcceptOrDeclineMembershipInvitation } from "../accept-or-decline-membership-invitation";
import { RevokedInvitation as RevokedInvitationComponent } from "../revoked-invitation";
import { AlreadyAcceptedInvitation as AlreadyAcceptedInvitationComponent } from "../already-accepted-invitation";

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
    />
  </div>
);

export const RevokedInvitation = () => (
  <div style={{ width: "100vw", height: "100vh", backgroundColor: "grey" }}>
    <RevokedInvitationComponent invitationEmailAddress="toto@sterblue.com" />
  </div>
);

export const AlreadyAcceptedInvitation = () => (
  <div style={{ width: "100vw", height: "100vh", backgroundColor: "grey" }}>
    <AlreadyAcceptedInvitationComponent userInMembershipEmailAddress="toto@sterblue.com" />
  </div>
);
