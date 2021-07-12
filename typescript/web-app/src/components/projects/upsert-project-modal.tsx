import { useMutation, useLazyQuery, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { useEffect, useState, useCallback, useRef } from "react";
import debounce from "lodash/fp/debounce";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalFooter,
  Button,
  ModalHeader,
  Heading,
  ModalBody,
  Input,
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/react";

const debounceTime = 200;

const createProjectMutation = gql`
  mutation createProject($name: String!) {
    createProject(data: { name: $name }) {
      id
    }
  }
`;

const updateProjectMutation = gql`
  mutation updateProject($id: ID, $name: String!) {
    updateProject(where: { id: $id }, data: { name: $name }) {
      id
    }
  }
`;

const getProjectByNameQuery = gql`
  query getProjectByName($name: String) {
    project(where: { name: $name }) {
      id
      name
    }
  }
`;

const getProjectByIdQuery = gql`
  query getProjectById($id: ID) {
    project(where: { id: $id }) {
      id
      name
    }
  }
`;

const getProjectsQuery = gql`
  query getProjects {
    projects {
      id
      name
      images {
        id
        url
      }
    }
  }
`;

export const UpsertProjectModal = ({
  isOpen = false,
  onClose = () => {},
  projectId = undefined,
}: {
  isOpen?: boolean;
  onClose?: () => void;
  projectId?: string;
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [projectName, setProjectName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useQuery(getProjectByIdQuery, {
    skip: typeof projectId !== "string",
    variables: { id: projectId },
    fetchPolicy: "cache-and-network",
    onError: (e) => {
      setErrorMessage(e.message);
    },
    onCompleted: ({ project }) => {
      setInputValue(project.name);
      setProjectName(project.name);
    },
  });

  const [queryExistingProjects, { data: existingProject }] = useLazyQuery(
    getProjectByNameQuery,
    { fetchPolicy: "network-only" }
  );

  const [createProjectMutate] = useMutation(createProjectMutation, {
    variables: {
      name: projectName,
    },
    refetchQueries: [{ query: getProjectsQuery }],
  });

  const [updateProjectMutate] = useMutation(updateProjectMutation, {
    variables: {
      id: projectId,
      name: projectName,
    },
    refetchQueries: [{ query: getProjectsQuery }],
  });

  const closeModal = useCallback(() => {
    onClose();
    setErrorMessage("");
    setProjectName("");
    setInputValue("");
  }, [onClose]);

  const handleInputValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setProjectName(e.target.value.trim());
  };

  const debouncedQuery = useRef(
    debounce(debounceTime, (nextName: string) => {
      queryExistingProjects({
        variables: { name: nextName },
      });
    })
  ).current;

  useEffect(() => {
    if (projectName === "") return;

    debouncedQuery(projectName);
  }, [projectName]);

  useEffect(() => {
    if (existingProject != null && existingProject?.project?.id !== projectId) {
      setErrorMessage("This name is already taken");
    } else {
      setErrorMessage("");
    }
  }, [existingProject]);

  const createProject = async () => {
    if (projectName === "") return;

    try {
      if (projectId) {
        await updateProjectMutate();
      } else {
        await createProjectMutate();
      }

      closeModal();
    } catch (e) {
      setErrorMessage(e.message);
    }
  };

  const isInputValid = () => errorMessage === "";

  const canCreateProject = () => projectName !== "" && isInputValid();

  return (
    <Modal isOpen={isOpen} size="xl" onClose={closeModal}>
      <ModalOverlay />
      <ModalContent
        as="form"
        onSubmit={(e) => {
          e.preventDefault();
          createProject();
        }}
      >
        <ModalCloseButton />

        <ModalHeader textAlign="center" padding="6">
          <Heading as="h2" size="lg" pb="2">
            {projectId ? "Edit project" : "New Project"}
          </Heading>
        </ModalHeader>

        <ModalBody pt="0" pb="6" pr="20" pl="20">
          <FormControl isInvalid={!isInputValid()} isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              value={inputValue}
              placeholder="Project name"
              size="md"
              onChange={handleInputValueChange}
              aria-label="Project name input"
              autoFocus
            />
            <FormErrorMessage>{errorMessage}</FormErrorMessage>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            type="submit"
            colorScheme="brand"
            disabled={!canCreateProject()}
            aria-label={projectId ? "Update project" : "Create Project"}
          >
            {projectId ? "Update project" : "Start Labelling"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
