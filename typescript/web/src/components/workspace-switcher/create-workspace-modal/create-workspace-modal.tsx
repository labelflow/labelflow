import {
  Box,
  Button,
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
import { isEmpty } from "lodash/fp";
import React, {
  createContext,
  FC,
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { StringParam, useQueryParam } from "use-query-params";
import { Features } from "../../auth-manager/signin-modal/features";
import { Logo } from "../../logo";
import {
  useWorkspaceNameInput,
  WorkspaceNameInput,
  WorkspaceNameInputProvider,
  WorkspaceNameMessage,
} from "../../workspace-name-input";
import { useCreateWorkspace } from "./create-workspace.mutation";

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

const CreateButton: FC<{ isDisabled?: boolean }> = ({ isDisabled }) => (
  <Button
    width="full"
    type="submit"
    isDisabled={isDisabled}
    colorScheme="brand"
    aria-label="create workspace button"
  >
    Create
  </Button>
);

const FormBody = () => {
  const { name, error: nameError } = useWorkspaceNameInput();
  const [create, { error: createError, loading }] = useCreateWorkspace(name);
  const isDisabled = loading ? false : !isEmpty(nameError);
  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!isDisabled) {
        create();
      }
    },
    [isDisabled, create]
  );
  return (
    <form onSubmit={handleSubmit}>
      <WorkspaceName error={createError?.message} />
      <CreateButton isDisabled={isDisabled} />
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
