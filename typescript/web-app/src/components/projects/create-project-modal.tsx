import { useApolloClient, useQuery } from "@apollo/client";
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
  FormHelperText,
} from "@chakra-ui/react";

const debounceTime = 200;

const createProjectMutation = gql`
  mutation createProject($name: String) {
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

export const CreateProjectModal = ({
  isOpen = false,
  onClose = () => {},
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) => {
  const client = useApolloClient();

  const [projectName, setProjectName] = useState<String>("");
  const [errorMessage, setErrorMessage] = useState<String>("");

  const closeModal = useCallback(() => {
    onClose();
    setErrorMessage("");
    setProjectName("");
  }, []);

  const handleChangeProjectName = useCallback(
    debounce(debounceTime, (e: any) => {
      setProjectName(e.target.value.trim());
    }),
    []
  );

  const createProject = async () => {
    if (projectName === "") return;

    try {
      await client.mutate({
        mutation: createProjectMutation,
        variables: {
          name: projectName,
        },
      });

      closeModal();
    } catch (e) {
      setErrorMessage(e.message);
    }
  };

  const { data: existingProject } = useQuery(getProjectByNameQuery, {
    variables: { name: projectName },
  });

  useEffect(() => {
    if (existingProject != null) {
      setErrorMessage("This name is already taken");
    } else {
      setErrorMessage("");
    }
  }, [existingProject]);

  const isInvalid = () => errorMessage !== "";

  return (
    <Modal isOpen={isOpen} size="3xl" onClose={closeModal}>
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
            New Project
          </Heading>
        </ModalHeader>

        <ModalBody pt="0" pb="6" pr="6" pl="6">
          <FormControl isInvalid={isInvalid()} isRequired>
            <Input
              placeholder="Project name"
              size="md"
              onChange={handleChangeProjectName}
            />
            <FormErrorMessage>{errorMessage}</FormErrorMessage>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            type="submit"
            colorScheme="brand"
            disabled={projectName === "" || isInvalid()}
          >
            Start
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
