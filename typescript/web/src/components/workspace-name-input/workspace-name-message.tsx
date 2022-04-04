import { isEmpty } from "lodash/fp";
import { useMockableLocation } from "../../utils/mockable-location";
import { OptionalText } from "../core";
import { useWorkspaceNameInput } from "./workspace-name-input.context";

const useErrorMessage = (
  customError: string | undefined,
  hideInvalid: boolean
): string | undefined => {
  const { error: nameError, loading } = useWorkspaceNameInput();
  const error = isEmpty(customError) ? nameError : customError;
  const hasError = !hideInvalid && !loading && !isEmpty(error);
  return hasError ? error : undefined;
};

const useUrlMessage = (
  error: string | undefined,
  isEditing: boolean | undefined
): string | undefined => {
  const { slug } = useWorkspaceNameInput();
  const { origin } = useMockableLocation();
  const hideUrl = !isEmpty(error) || isEmpty(slug) || isEmpty(origin);
  if (hideUrl) return undefined;
  const workspaceUrl = `${origin}/${slug}`;
  return isEditing
    ? `Workspace URL: ${workspaceUrl}`
    : `URL will be: ${workspaceUrl}`;
};

export interface WorkspaceNameMessageProps {
  customError?: string;
  hideError: boolean;
  isEditing?: boolean;
}

export const WorkspaceNameMessage = ({
  customError,
  hideError,
  isEditing,
}: WorkspaceNameMessageProps) => {
  const error = useErrorMessage(customError, hideError);
  const text = useUrlMessage(error, isEditing);
  return (
    <OptionalText
      text={text}
      error={error}
      aria-label="workspace name message"
    />
  );
};
