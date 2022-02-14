import { Profile } from "./profile";
import { SettingsContainer } from "..";

export const UserSettings = ({
  user,
  changeUserName,
}: {
  user: { id: string; name?: string; image?: string };
  changeUserName: (name: string) => void;
}) => {
  return (
    <SettingsContainer>
      <Profile user={user} changeUserName={changeUserName} />
    </SettingsContainer>
  );
};
