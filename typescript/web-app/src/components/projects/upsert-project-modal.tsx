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
  const [projectNameInputValue, setProjectNameInputValue] =
    useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const projectName = projectNameInputValue.trim();

  useQuery(getProjectByIdQuery, {
    skip: typeof projectId !== "string",
    variables: { id: projectId },
    fetchPolicy: "cache-and-network",
    onError: (e) => {
      setErrorMessage(e.message);
    },
    onCompleted: ({ project }) => {
      setProjectNameInputValue(project.name);
    },
  });

  const [
    queryExistingProjects,
    {
      data: existingProject,
      loading: loadingExistingProjects,
      variables: variablesExistingProjects,
    },
  ] = useLazyQuery(getProjectByNameQuery, { fetchPolicy: "network-only" });

  const [createProjectMutate] = useMutation(createProjectMutation, {
    variables: {
      name: projectName,
    },
    refetchQueries: ["getProjects"],
    awaitRefetchQueries: true,
  });

  const [updateProjectMutate] = useMutation(updateProjectMutation, {
    variables: {
      id: projectId,
      name: projectName,
    },
    refetchQueries: [{ query: getProjectsQuery }],
  });

  const handleInputValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectNameInputValue(e.target.value);
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
    if (
      existingProject != null &&
      !loadingExistingProjects &&
      existingProject?.project?.id !== projectId &&
      variablesExistingProjects?.name === projectName
    ) {
      setErrorMessage("This name is already taken");
    } else {
      setErrorMessage("");
    }
  }, [existingProject, projectId, loadingExistingProjects, projectName]);

  const createProject = useCallback(
    async (event) => {
      event.preventDefault();
      if (projectName === "") return;

      try {
        if (projectId) {
          await updateProjectMutate();
        } else {
          await createProjectMutate();
        }

        onClose();
      } catch (error) {
        setErrorMessage(error.message);
      }
    },
    [projectName, onClose]
  );

  const isInputValid = () => errorMessage === "";

  const canCreateProject = () => projectName !== "" && isInputValid();

  useEffect(
    () => () => {
      if (!isOpen) {
        setProjectNameInputValue("");
        setErrorMessage("");
      }
    },
    [isOpen]
  );

  return (
    <Modal isOpen={isOpen} size="xl" onClose={onClose}>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={createProject}>
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
              value={projectNameInputValue}
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
