import * as React from "react";
// import { Workspace } from "@labelflow/graphql-types";

import { SettingsContainer } from "../container";
import { Profile } from "./profile";
import { DangerZone } from "./danger-zone";

import { Box, Stack } from "@chakra-ui/react";

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
      <Profile workspace={workspace} />
      <DangerZone />
    </SettingsContainer>
    // <SettingsContainer>
    //   OKOKO
    //   {/* <Profile
    //   workspace={workspace}
    //   changeName={changeName}
    //   changeImage={changeImage}
    // />
    //  */}
    // </SettingsContainer>
  );
};
