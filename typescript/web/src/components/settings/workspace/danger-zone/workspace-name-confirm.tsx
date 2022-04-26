import { Input, Stack } from "@chakra-ui/react";
import { ChangeEvent, useCallback } from "react";
import { useWorkspaceSettings } from "../context";
import { useDeleteWorkspace } from "./delete-workspace.state";

const NameInput = () => {
  const { name: workspaceName } = useWorkspaceSettings();
  const { name, setName } = useDeleteWorkspace();
  const handleChangeName = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setName(event.target.value),
    [setName]
  );
  return (
    <Input
      aria-label="workspace name input"
      placeholder={workspaceName}
      value={name}
      onChange={handleChangeName}
    />
  );
};

export const WorkspaceNameConfirm = () => (
  <Stack>
    <div>Enter this workspace name to confirm</div>
    <NameInput />
  </Stack>
);
