import { Button, Center, chakra, Flex, Heading, Text } from "@chakra-ui/react";
import { isEmpty } from "lodash";
import { FC, useCallback, FormEvent } from "react";
import { useWorkspaces } from "../../hooks";
import NoWorkspacesGraphics from "../graphics/no-workspace";
import {
  useWorkspaceNameInput,
  WorkspaceNameInput,
  WorkspaceNameInputProvider,
  WorkspaceNameMessage,
} from "../workspace-name-input";
import { useCreateWorkspace } from "../workspace-switcher/create-workspace-modal";
import {
  WorkspacesContextProvider,
  WorkspacesProps,
} from "./workspaces-context";
import { WorkspacesList } from "./workspaces-list";

const ChakraNoWorkspaces = chakra(NoWorkspacesGraphics);

const CreateButton: FC<{ isDisabled?: boolean }> = ({ isDisabled }) => (
  <Button
    width="full"
    type="submit"
    isDisabled={isDisabled}
    colorScheme="brand"
    aria-label="create workspace button"
    mt="8"
  >
    Create
  </Button>
);

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
        <CreateButton isDisabled={isDisabled} />
      </form>
    </Flex>
  );
};

const NoWorkspaces = () => (
  <Center my="auto" h="full">
    <Flex direction="column" align="center">
      <ChakraNoWorkspaces />
      <Heading mt="8" textAlign="center">
        You don&apos;t have any workspaces.
      </Heading>
      <Text mt="4" textAlign="center">
        Workspaces allow you to store your image datasets.
      </Text>
      <CreateWorkspaceForm />
    </Flex>
  </Center>
);

export const Workspaces = (props: WorkspacesProps) => {
  const workspaces = useWorkspaces();
  return (
    <WorkspacesContextProvider {...props}>
      <WorkspaceNameInputProvider>
        {workspaces.length > 0 ? <WorkspacesList /> : <NoWorkspaces />}
      </WorkspaceNameInputProvider>
    </WorkspacesContextProvider>
  );
};
