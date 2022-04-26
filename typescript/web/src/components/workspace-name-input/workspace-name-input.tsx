import { Input, InputProps } from "@chakra-ui/react";
import { isNil } from "lodash/fp";
import { ChangeEvent, FC, useCallback } from "react";
import { useWorkspaceNameInput } from "./workspace-name-input.context";

export interface WorkspaceNameInputProps
  extends Omit<InputProps, "value" | "onChange" | "isInvalid"> {
  hideInvalid?: boolean;
}

export const WorkspaceNameInput: FC<WorkspaceNameInputProps> = ({
  focusBorderColor,
  hideInvalid,
  ...props
}) => {
  const { name, setName, error, loading } = useWorkspaceNameInput();
  const handleChangeName = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setName(event.target.value),
    [setName]
  );
  const invalidate = !hideInvalid && !loading && !isNil(error);
  return (
    <Input
      {...props}
      aria-label="workspace name input"
      focusBorderColor={invalidate ? "red.500" : focusBorderColor}
      value={name}
      onChange={handleChangeName}
      isInvalid={invalidate}
    />
  );
};
