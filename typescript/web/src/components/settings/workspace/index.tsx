import * as React from "react";
import { Workspace } from "@labelflow/graphql-types";

import { SettingsContainer } from "../container";
import { Profile } from "./profile";
// import { DangerZone } from "./danger-zone";

export const WorkspaceSettings = ({ workspace }: { workspace?: Workspace }) => {
  return (
    <SettingsContainer>
      <Profile workspace={workspace} />
      {/* <DangerZone /> */}
    </SettingsContainer>
  );
};
