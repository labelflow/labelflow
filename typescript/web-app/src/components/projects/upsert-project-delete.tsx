import { gql, useQuery, useMutation } from "@apollo/client";
import { useRef } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";

const getProjectByIdQuery = gql`
  query getProjectById($id: ID) {
    project(where: { id: $id }) {
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

const deleteProjectByIdMutation = gql`
  mutation deleteProjectById($id: ID) {
    deleteProject(where: { id: $id }) {
      id
    }
  }
`;

export const UpsertProjectDelete = ({
  isOpen = false,
  onClose = () => {},
  projectId = undefined,
}: {
  isOpen?: boolean;
  onClose?: () => void;
  projectId?: string;
}) => {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const { data } = useQuery(getProjectByIdQuery, {
    variables: { id: projectId },
  });

  const [deleteProjectMutate] = useMutation(deleteProjectByIdMutation, {
    variables: { id: projectId },
    refetchQueries: [{ query: getProjectsQuery }],
  });

  const deleteProject = async () => {
    await deleteProjectMutate();
    onClose();
  };

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>
            Delete Project {data?.project?.name}
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure? Images, Labels and Classes will be deleted. This
            action cannot be undone.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              onClick={onClose}
              aria-label="Cancel delete"
            >
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={deleteProject}
              aria-label="Project delete"
              ml={3}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
