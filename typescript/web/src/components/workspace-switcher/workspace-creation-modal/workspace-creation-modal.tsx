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
import React, {
  FC,
  useCallback,
  useEffect,
  createContext,
  useContext,
  useState,
} from "react";
import { StringParam, useQueryParam } from "use-query-params";
import { Features } from "../../auth-manager/signin-modal/features";
import { Logo } from "../../logo";
import { useCreateWorkspace } from "./create-workspace";
import { useWorkspaceNameInput, WorkspaceNameInputProvider } from "./store";
import {
  WorkspaceNameInput,
  WorkspaceNameMessage,
} from "./workspace-name-input";

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

const CreateButton: FC<{
  createWorkspace: () => void;
  isInvalid: boolean;
}> = ({ createWorkspace, isInvalid }) => {
  // Avoid passing the event args to createWorkspace() which accepts a different
  // argument type
  const handleSubmit = useCallback(() => createWorkspace(), [createWorkspace]);
  return (
    <Button
      width="full"
      type="submit"
      isDisabled={isInvalid}
      colorScheme="brand"
      onClick={handleSubmit}
      aria-label="Create workspace"
    >
      Create
    </Button>
  );
};

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
  }, [
    queryName,
    lastIsOpen,
    queryName,
    storeName,
    setStoreName,
    setLastIsOpen,
  ]);
  return <></>;
};

const FormBody = () => {
  const { name, isInvalid, workspaceExists } = useWorkspaceNameInput();
  const [createWorkspace, { error }] = useCreateWorkspace(name);
  const isEmpty = name.length === 0;
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <Stack spacing="1" mb="4">
        <NameLabel />
        <WorkspaceNameQueryParamObserver />
        <WorkspaceNameInput hideInvalid={isEmpty} />
        <WorkspaceNameMessage error={error?.message} hideInvalid={isEmpty} />
      </Stack>
      <CreateButton
        createWorkspace={createWorkspace}
        isInvalid={
          isInvalid || workspaceExists || workspaceExists === undefined
        }
      />
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

export interface WorkspaceCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WorkspaceCreationModal = ({
  isOpen,
  onClose,
}: WorkspaceCreationModalProps) => (
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
