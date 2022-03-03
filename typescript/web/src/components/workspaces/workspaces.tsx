import {
  Center,
  chakra,
  Flex,
  Heading,
  Text,
  useBoolean,
} from "@chakra-ui/react";
import { isEmpty } from "lodash";
import { isNil } from "lodash/fp";
import { FormEvent, useCallback } from "react";
import { useOptionalWorkspaces, useWorkspaces } from "../../hooks";
import NoWorkspacesGraphics from "../graphics/no-workspace";
import { LayoutSpinner } from "../core";
import {
  useWorkspaceNameInput,
  WorkspaceNameInput,
  WorkspaceNameInputProvider,
  WorkspaceNameMessage,
} from "../workspace-name-input";
import {
  CreateWorkspaceModal,
  useCreateWorkspace,
} from "../workspace-switcher/create-workspace-modal";
import { CreateWorkspaceButton } from "../workspace-switcher/create-workspace-modal/create-workspace-button";
import {
  WorkspacesContextProvider,
  WorkspacesProps,
} from "./workspaces-context";
import { WorkspacesList } from "./workspaces-list";

const ChakraNoWorkspaces = chakra(NoWorkspacesGraphics);

const useSubmitForm = (isDisabled: boolean, create: () => void) =>
  useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (isDisabled) return;
      create();
    },
    [create, isDisabled]
  );

const CreateWorkspaceForm = () => {
  const { name, error: nameError } = useWorkspaceNameInput();
  const [create, isLoading, createError] = useCreateWorkspace();
  const isDisabled = isLoading ? false : !isEmpty(nameError);
  const empty = name.length === 0;
  const handleSubmit = useSubmitForm(isDisabled, create);

  return (
    <Flex direction="column" align="start" w="full" maxWidth="sm" mt="16">
      <Text>Workspace name</Text>
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <WorkspaceNameInput hideInvalid={empty} bgColor="white" />
        <WorkspaceNameMessage customError={createError} hideError={empty} />
        <CreateWorkspaceButton isDisabled={isDisabled} isLoading={isLoading} />
      </form>
    </Flex>
  );
};

const NoWorkspaces = () => (
  <Center my="auto" h="full">
    <Flex direction="column" align="center">
      <ChakraNoWorkspaces />
      <Heading mt="8" textAlign="center">
        Create your first workspace
      </Heading>
      <Text mt="4" textAlign="center">
        Workspaces allow you to store your image datasets
      </Text>
      <CreateWorkspaceForm />
    </Flex>
  </Center>
);

const WorkspacesBody = (props: WorkspacesProps) => {
  const workspaces = useWorkspaces();
  return (
    <WorkspacesContextProvider {...props}>
      <WorkspaceNameInputProvider>
        {workspaces.length > 0 ? <WorkspacesList /> : <NoWorkspaces />}
      </WorkspaceNameInputProvider>
    </WorkspacesContextProvider>
  );
};

export const Workspaces = () => {
  const [
    showCreateWorkspaceModal,
    { on: openCreateWorkspaceModal, off: closeCreateWorkspaceModal },
  ] = useBoolean(false);
  const workspaces = useOptionalWorkspaces();
  return (
    <>
      {isNil(workspaces) ? (
        <LayoutSpinner />
      ) : (
        <>
          <WorkspacesBody openCreateWorkspaceModal={openCreateWorkspaceModal} />
          <CreateWorkspaceModal
            isOpen={showCreateWorkspaceModal}
            onClose={closeCreateWorkspaceModal}
          />
        </>
      )}
    </>
  );
};
