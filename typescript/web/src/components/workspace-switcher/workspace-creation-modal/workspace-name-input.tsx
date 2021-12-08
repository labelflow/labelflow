import {
  Input,
  InputProps,
  Text,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { ChangeEvent, FC, useCallback } from "react";
import { useWorkspaceNameInput } from "./store";

export interface WorkspaceNameInputProps
  extends Omit<InputProps, "value" | "onChange" | "isInvalid"> {
  hideInvalid?: boolean;
}

export const WorkspaceNameInput: FC<WorkspaceNameInputProps> = ({
  focusBorderColor,
  hideInvalid,
  ...props
}) => {
  const { name, setName, isInvalid, workspaceExists } = useWorkspaceNameInput();
  const handleChangeName = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setName(event.target.value),
    [setName]
  );
  const invalidate = !hideInvalid && (isInvalid || workspaceExists);
  return (
    <Input
      {...props}
      aria-label="workspace name input"
      focusBorderColor={invalidate ? "red.500" : focusBorderColor}
      placeholder="My online workspace name"
      value={name}
      onChange={handleChangeName}
      isInvalid={invalidate}
    />
  );
};

interface TextMessageProps {
  message: string | undefined;
  color?: string;
}

const TextMessage: FC<TextMessageProps> = ({ message, color }) => (
  <Text
    fontSize="sm"
    color={color}
    visibility={!message ? "hidden" : undefined}
  >
    {message ?? <br />}
  </Text>
);

interface WorkspaceNameMessageProps {
  error?: string;
  isOnlyDisplaying?: boolean;
  hideInvalid: boolean;
}

function getMessageProps(props: WorkspaceNameMessageProps): TextMessageProps {
  const {
    name,
    slug,
    error: nameError,
    workspaceExists,
    isInvalid,
  } = useWorkspaceNameInput();
  const { error = nameError, isOnlyDisplaying, hideInvalid } = props;
  const errorColor = "red.500";
  if (error) {
    return { message: error, color: errorColor };
  }
  if (isInvalid && !hideInvalid) {
    return {
      message:
        name.length === 0
          ? "Workspace name is empty"
          : `Workspace name "${name}" is invalid`,
      color: errorColor,
    };
  }
  if (workspaceExists && !isOnlyDisplaying) {
    return {
      message: `Workspace name "${slug}" is already taken`,
      color: errorColor,
    };
  }
  if (slug && globalThis.location) {
    const color = mode("gray.800", "gray.200");
    const workspaceUrl = `${globalThis.location.origin}/${slug}`;
    const message = isOnlyDisplaying
      ? `Workspace URL: ${workspaceUrl}`
      : `URL will be: ${workspaceUrl}`;
    return { message, color };
  }
  return { message: undefined };
}

export const WorkspaceNameMessage: FC<WorkspaceNameMessageProps> = (state) => {
  const props = getMessageProps(state);
  return <TextMessage {...props} />;
};
