import * as React from "react";
import { Workspace } from "@labelflow/graphql-types";

import { SettingsContainer } from "..";
import { Profile } from "./profile";
import { DangerZone } from "./danger-zone";

export const WorkspaceSettings = ({
  workspace,
  changeName,
  changeImage,
}: {
  workspace: Workspace;
  changeName: (name: string) => void;
  changeImage: (image: string) => void;
}) => {
  return (
    <SettingsContainer>
      <Profile
        workspace={workspace}
        changeName={changeName}
        changeImage={changeImage}
      />
      <DangerZone />
    </SettingsContainer>
  );
};
