import {
  getSlug,
  INVALID_WORKSPACE_NAME_MESSAGES,
  validateWorkspaceName,
} from "@labelflow/common-resolvers";
import { isEmpty, isNil } from "lodash/fp";
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";
import { useDebounce } from "use-debounce";
import { getApolloErrorMessage } from "../../utils/get-apollo-error-message";
import { useWorkspaceExistsQuery } from "./workspace-exists.query";

export interface WorkspaceNameInputState {
  name: string;
  setName: (name: string) => void;
  slug: string;
  loading: boolean;
  error?: string;
}

const DEFAULT_STATE: WorkspaceNameInputState = {
  name: "",
  setName: () => {},
  slug: "",
  loading: false,
  error: undefined,
};

const WorkspaceNameInputContext =
  createContext<WorkspaceNameInputState>(DEFAULT_STATE);

export interface WorkspaceNameInputProviderProps extends PropsWithChildren<{}> {
  defaultName?: string;
}

const useValidName = (name: string, slug: string): string | undefined => {
  const nameError = useMemo(
    () => validateWorkspaceName(name, slug),
    [name, slug]
  );
  return !isNil(nameError)
    ? INVALID_WORKSPACE_NAME_MESSAGES[nameError]
    : undefined;
};

const useSkipQuery = (
  slug: string,
  defaultName: string,
  skip: boolean
): [boolean, boolean] => {
  const [debouncedSlug] = useDebounce(slug, 250, {
    leading: true,
    trailing: true,
  });
  const isDebouncing = slug !== debouncedSlug;
  const skipQuery =
    skip || isDebouncing || isEmpty(slug) || slug === getSlug(defaultName);
  return [skipQuery, isDebouncing];
};

const useWorkspaceExists = (
  slug: string,
  defaultName: string,
  skip: boolean
) => {
  const [skipQuery, isDebouncing] = useSkipQuery(slug, defaultName, skip);
  const result = useWorkspaceExistsQuery(slug, { skip: skipQuery });
  const loading = isDebouncing || result.loading;
  const error =
    result.variables?.slug === slug && !skipQuery ? result.error : undefined;
  return { ...result, loading, error };
};

const useDontExist = (
  slug: string,
  defaultName: string,
  skip: boolean
): [boolean, string | undefined] => {
  const { data, error, loading } = useWorkspaceExists(slug, defaultName, skip);
  if (skip) return [false, undefined];
  const apolloError = isNil(error) ? undefined : getApolloErrorMessage(error);
  const errorMessage =
    apolloError ||
    (data?.workspaceExists
      ? INVALID_WORKSPACE_NAME_MESSAGES.workspaceExists
      : undefined);
  return [loading, errorMessage];
};

const useValidation = (
  name: string,
  slug: string,
  defaultName: string
): { loading: boolean; error: string | undefined } => {
  const nameError = useValidName(name, slug);
  const invalidName = !isEmpty(nameError);
  const [loading, existsError] = useDontExist(slug, defaultName, invalidName);
  return { error: invalidName ? nameError : existsError, loading };
};

export const WorkspaceNameInputProvider: FC<WorkspaceNameInputProviderProps> =
  ({ defaultName = "", children }) => {
    const [name, setName] = useState(defaultName);
    const slug = getSlug(name);
    const validation = useValidation(name, slug, defaultName);
    const value = { name, setName, slug, ...validation };
    return (
      <WorkspaceNameInputContext.Provider value={value}>
        {children}
      </WorkspaceNameInputContext.Provider>
    );
  };

export function useWorkspaceNameInput(): WorkspaceNameInputState {
  return useContext(WorkspaceNameInputContext);
}
