import {
  Box,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { isEmpty, isNil } from "lodash/fp";
import React, {
  createContext,
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { StringParam, useQueryParam } from "use-query-params";
import { getApolloErrorMessage } from "../../../utils/get-apollo-error-message";
import { Features } from "../../auth/features";
import { Logo } from "../../logo";
import {
  useWorkspaceNameInput,
  WorkspaceNameInput,
  WorkspaceNameInputProvider,
  WorkspaceNameMessage,
} from "../../workspace-name-input";
import { CreateWorkspaceButton } from "./create-workspace-button";
import { useCreateWorkspaceMutation } from "./create-workspace.mutation";

const ModalIsOpenContext = createContext(false);

const LogoSpacer = () => (
  <Logo
    h="9"
    mb={{ base: "16", lg: "10" }}
    iconColor="brand.600"
    mx={{ base: "auto", lg: "unset" }}
    visibility={{ base: "visible", lg: "hidden" }}
  />
);

const Title = () => (
  <Box mb="8" textAlign={{ base: "center", lg: "start" }}>
    <Heading size="lg" mb="2" fontWeight="extrabold">
      Create Workspace
    </Heading>
    <Text
      fontSize="lg"
      color={mode("gray.600", "gray.400")}
      fontWeight="medium"
    >
      Store your datasets online & start collaborating
    </Text>
  </Box>
);

const NameLabel = () => (
  <Text fontSize="sm" fontWeight="medium" color={mode("gray.800", "gray.200")}>
    Workspace Name
  </Text>
);

const WorkspaceNameQueryParamObserver = () => {
  const [queryName] = useQueryParam("workspace-name", StringParam);
  const { name: storeName, setName: setStoreName } = useWorkspaceNameInput();
  const isOpen = useContext(ModalIsOpenContext);
  const [lastIsOpen, setLastIsOpen] = useState(!isOpen);
  useEffect(() => {
    if (isOpen !== lastIsOpen) {
      if (isOpen && queryName !== storeName) {
        setStoreName(queryName ?? "");
      }
      setLastIsOpen(isOpen);
    }
  }, [isOpen, lastIsOpen, queryName, storeName, setStoreName, setLastIsOpen]);
  return <></>;
};

const WorkspaceName = ({ error }: { error: string | undefined }) => {
  const { name } = useWorkspaceNameInput();
  const empty = name.length === 0;
  return (
    <Stack spacing="1" mb="4">
      <NameLabel />
      <WorkspaceNameQueryParamObserver />
      <WorkspaceNameInput hideInvalid={empty} />
      <WorkspaceNameMessage customError={error} hideError={empty} />
    </Stack>
  );
};

export const useCreateWorkspace = (): [
  () => void,
  boolean,
  string | undefined
] => {
  const { name } = useWorkspaceNameInput();
  const [plan] = useQueryParam("plan", StringParam);
  const planToCreate = plan ?? "pro";
  const [create, { loading, error: createError, called }] =
    useCreateWorkspaceMutation(name, planToCreate);
  const error =
    isNil(createError) || !called
      ? undefined
      : getApolloErrorMessage(createError);
  return [create, loading, error];
};

const useForm = (create: () => void, isDisabled: boolean) => {
  return useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (isDisabled) return;
      create();
    },
    [create, isDisabled]
  );
};

const FormBody = () => {
  const [create, isLoading, createError] = useCreateWorkspace();
  const { error: nameError } = useWorkspaceNameInput();
  const isDisabled = isLoading ? false : !isEmpty(nameError);
  const handleSubmit = useForm(create, isLoading);
  return (
    <form onSubmit={handleSubmit}>
      <WorkspaceName error={createError} />
      <CreateWorkspaceButton isDisabled={isDisabled} isLoading={isLoading} />
    </form>
  );
};

const Form = () => (
  <WorkspaceNameInputProvider>
    <FormBody />
  </WorkspaceNameInputProvider>
);

const Body = () => (
  <ModalBody display="flex" p={{ base: "6", lg: "10" }} flexDirection="column">
    <SimpleGrid columns={{ base: 1, lg: 2 }} spacing="14">
      <Features />
      <Box w="full">
        <LogoSpacer />
        <Title />
        <Form />
      </Box>
    </SimpleGrid>
  </ModalBody>
);

export interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateWorkspaceModal = ({
  isOpen,
  onClose,
}: CreateWorkspaceModalProps) => (
  <ModalIsOpenContext.Provider value={isOpen}>
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior="inside"
      size="3xl"
      isCentered
    >
      <ModalOverlay />
      <ModalContent height="auto">
        <Body />
        <ModalCloseButton />
      </ModalContent>
    </Modal>
  </ModalIsOpenContext.Provider>
);
