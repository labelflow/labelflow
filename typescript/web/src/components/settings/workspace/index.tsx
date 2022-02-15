import { GetWorkspaceDetailsQuery } from "../../../graphql-types/GetWorkspaceDetailsQuery";
import { SettingsContainer } from "../container";
import { Billing } from "./billing";
import { useWorkspaceSettings, WorkspaceSettingsContext } from "./context";
import { SettingsDangerZone } from "./danger-zone/settings-danger-zone";
import { Profile } from "./profile";

export const WorkspaceSettingsBody = () => {
  const { stripeCustomerPortalUrl } = useWorkspaceSettings();
  return (
    <SettingsContainer>
      <Profile />
      {stripeCustomerPortalUrl && <Billing />}
      <SettingsDangerZone />
    </SettingsContainer>
  );
};

export const WorkspaceSettings = ({ workspace }: GetWorkspaceDetailsQuery) => (
  <WorkspaceSettingsContext.Provider value={workspace}>
    <WorkspaceSettingsBody />
  </WorkspaceSettingsContext.Provider>
);
