import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import gql from "graphql-tag";
import { useEffect, useState, useCallback } from "react";
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

const debounceTime = 2000;

const createProjectMutation = gql`
  mutation createProject($name: String!) {
    createProject(data: { name: $name }) {
      id
    }
  }
`;

const getProjectByNameQuery = gql`
  query getProjectByName($name: String) {
    project(where: { name: $name }) {
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
        url
      }
    }
  }
`;

export const CreateProjectModal = ({
  isOpen = false,
  onClose = () => {},
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) => {
  const [projectName, setProjectName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [hasAdded, setHasAdded] = useState(false);

  const closeModal = useCallback(() => {
    onClose();
    setErrorMessage("");
    setProjectName("");
  }, []);

  const handleChangeProjectName = (e: any) =>
    setProjectName(e.target.value.trim());

  const { refetch: refetchProjects } = useQuery(getProjectsQuery);

  useEffect(() => {
    if (hasAdded) {
      refetchProjects();
      setHasAdded(false);
    }
  }, [hasAdded]);

  const [queryExistingProject, { data: existingProject }] = useLazyQuery(
    getProjectByNameQuery,
    {
      variables: { name: projectName },
    }
  );

  const debouncedQuery = useCallback(
    debounce(debounceTime, queryExistingProject),
    []
  );

  useEffect(() => {
    if (projectName === "") return;

    debouncedQuery();
  }, [projectName]);

  const [createProjectMutate] = useMutation(createProjectMutation, {
    variables: {
      name: projectName,
    },
  });

  useEffect(() => {
    if (existingProject != null) {
      setErrorMessage("This name is already taken");
    } else {
      setErrorMessage("");
    }
  }, [existingProject]);

  const createProject = async () => {
    if (projectName === "") return;

    try {
      await createProjectMutate();

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
          setHasAdded(true);
        }}
      >
        <ModalCloseButton />

        <ModalHeader textAlign="center" padding="6">
          <Heading as="h2" size="lg" pb="2">
            New Project
          </Heading>
        </ModalHeader>

        <ModalBody pt="0" pb="6" pr="20" pl="20">
          <FormControl isInvalid={!isInputValid()} isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              value={projectName}
              placeholder="Project name"
              size="md"
              onChange={handleChangeProjectName}
              aria-label="Project name input"
            />
            <FormErrorMessage>{errorMessage}</FormErrorMessage>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            type="submit"
            colorScheme="brand"
            disabled={!canCreateProject()}
            aria-label="Create project"
          >
            Start
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
