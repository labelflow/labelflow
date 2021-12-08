import {
  forbiddenWorkspaceSlugs,
  isValidWorkspaceName,
} from "@labelflow/common-resolvers";
import {
  createContext,
  FC,
  PropsWithChildren,
  useMemo,
  useState,
  useContext,
} from "react";
import slugify from "slugify";
import { useWorkspaceExists } from "./workspace-exists";

export function validateWorkspaceName(name: string, slug: string): boolean {
  return (
    name.length === 0 ||
    slug.length === 0 ||
    forbiddenWorkspaceSlugs.includes(slug) ||
    !isValidWorkspaceName(name)
  );
}

export interface WorkspaceNameInputState {
  name: string;
  slug: string;
  isInvalid: boolean;
  workspaceExists?: boolean;
  error?: string;
  setName: (name: string) => void;
}

const DEFAULT_STATE: WorkspaceNameInputState = {
  name: "",
  slug: "",
  isInvalid: true,
  workspaceExists: undefined,
  error: undefined,
  setName: () => {},
};

const WorkspaceNameInputContext =
  createContext<WorkspaceNameInputState>(DEFAULT_STATE);

export interface WorkspaceNameInputProviderProps extends PropsWithChildren<{}> {
  name?: string;
}

export const WorkspaceNameInputProvider: FC<WorkspaceNameInputProviderProps> =
  ({ name: defaultName = "", children }) => {
    const [name, setName] = useState(defaultName);
    const slug = useMemo(() => slugify(name, { lower: true }), [name]);
    const isInvalid = useMemo(
      () => validateWorkspaceName(name, slug),
      [name, slug]
    );
    const [workspaceExists, workspaceExistsError] = useWorkspaceExists(slug);
    const error = workspaceExistsError?.message;
    return (
      <WorkspaceNameInputContext.Provider
        value={{ name, setName, slug, isInvalid, workspaceExists, error }}
      >
        {children}
      </WorkspaceNameInputContext.Provider>
    );
  };

export function useWorkspaceNameInput(): WorkspaceNameInputState {
  return useContext(WorkspaceNameInputContext);
}
