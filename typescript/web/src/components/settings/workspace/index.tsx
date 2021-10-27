import * as React from "react";
import { Workspace } from "@labelflow/graphql-types";

import { SettingsContainer } from "../container";
import { Profile } from "./profile";
import { Billing } from "./billing";
// import { DangerZone } from "./danger-zone";

export const WorkspaceSettings = ({ workspace }: { workspace?: Workspace }) => {
  return (
    <SettingsContainer>
      <Profile workspace={workspace} />
      {workspace?.stripeCustomerPortalUrl && <Billing workspace={workspace} />}
      {/* <DangerZone /> */}
    </SettingsContainer>
  );
};
