import { Stack } from "@chakra-ui/react";
import { HeadingGroup } from "../../heading-group";
import { DeleteWorkspace } from "./delete-workspace";

export const SettingsDangerZone = () => (
  <Stack as="section" spacing="6">
    <HeadingGroup
      title="Danger zone"
      description="Irreversible and destructive actions"
    />
    <DeleteWorkspace />
  </Stack>
);
