import React from "react";
import { chakraDecorator } from "../../../utils/chakra-decorator";
import { apolloDecorator } from "../../../utils/apollo-decorator";
import { queryParamsDecorator } from "../../../utils/query-params-decorator";

import { AcceptOrDeclineMembershipInvitation } from "../accept-or-decline-membership-invitation";

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
