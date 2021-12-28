import { Workspace } from "@labelflow/graphql-types";
import { SettingsContainer } from "../container";
import { Billing } from "./billing";
import { useWorkspaceSettings, WorkspaceSettingsContext } from "./context";
import { SettingsDangerZone } from "./danger-zone/settings-danger-zone";
import { Profile } from "./profile";

export const WorkspaceSettingsBody = () => {
  const workspace = useWorkspaceSettings();
  return (
    <SettingsContainer>
      <Profile />
      {workspace?.stripeCustomerPortalUrl && <Billing />}
      <SettingsDangerZone />
    </SettingsContainer>
  );
};

export const WorkspaceSettings = ({ workspace }: { workspace?: Workspace }) => (
  <WorkspaceSettingsContext.Provider value={workspace}>
    <WorkspaceSettingsBody />
  </WorkspaceSettingsContext.Provider>
);
