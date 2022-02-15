import { useBoolean } from "@chakra-ui/react";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useWorkspaceSettings } from "../context";
import { useDeleteWorkspaceMutation } from "./delete-workspace.mutation";

export interface DeleteWorkspaceState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  name: string;
  setName: (name: string) => void;
  canDelete: boolean;
  deleteWorkspace: () => void;
  isDeleting: boolean;
}

const DEFAULT_STATE: DeleteWorkspaceState = {
  isOpen: false,
  open: () => {},
  close: () => {},
  name: "",
  setName: () => {},
  canDelete: false,
  deleteWorkspace: () => {},
  isDeleting: false,
};

const Context = createContext(DEFAULT_STATE);

export const DeleteWorkspaceProvider = ({
  children,
}: PropsWithChildren<{}>) => {
  const [isOpen, { on: open, off: close }] = useBoolean();
  const { name: workspaceName } = useWorkspaceSettings();
  const [name, setName] = useState(DEFAULT_STATE.name);
  const [deleteWorkspace, { loading: isDeleting }] =
    useDeleteWorkspaceMutation();
  const canDelete = useMemo(
    () => !isDeleting && name === workspaceName,
    [isDeleting, name, workspaceName]
  );
  const handleDeleteWorkspace = useCallback(() => {
    if (!canDelete) return;
    deleteWorkspace();
  }, [canDelete, deleteWorkspace]);
  return (
    <Context.Provider
      value={{
        isOpen,
        open,
        close,
        name,
        setName,
        canDelete,
        deleteWorkspace: handleDeleteWorkspace,
        isDeleting,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useDeleteWorkspace = () => useContext(Context);
