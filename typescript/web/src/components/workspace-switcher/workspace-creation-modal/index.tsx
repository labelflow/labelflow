import { ApolloError, gql, useMutation, useQuery } from "@apollo/client";
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
  Input,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

import React, { useState, useEffect } from "react";
import slugify from "slugify";
import { Logo } from "../../logo";
import { Features } from "../../auth-manager/signin-modal/features";

const Message = ({
  error,
  workspaceName,
  workspaceNameIsAlreadyTaken,
}: {
  error: ApolloError | undefined;
  workspaceName: string | undefined;
  workspaceNameIsAlreadyTaken: boolean;
}) => {
  if (error) {
    return (
      <Text fontSize="sm" color="red.500">
        {error.message}
      </Text>
    );
  }

  if (workspaceNameIsAlreadyTaken) {
    return (
      <Text fontSize="sm" color="red.500">
        The name &quot;{workspaceName}&quot; is already taken
      </Text>
    );
  }

  if (workspaceName && globalThis.location) {
    const slug = slugify(workspaceName, { lower: true });

    return (
      <Text fontSize="sm" color={mode("gray.800", "gray.200")}>
        Your URL will be: {`${globalThis.location.origin}/${slug}`}
      </Text>
    );
  }

  return (
    <Text fontSize="sm" visibility="hidden">
      <br />
    </Text>
  );
};

const searchWorkspacesQuery = gql`
  query searchWorkspaces($slug: String!) {
    workspaces(first: 1, where: { slug: $slug }) {
      id
    }
  }
`;

const createWorkspaceMutation = gql`
  mutation createWorkspace($name: String!) {
    createWorkspace(data: { name: $name }) {
      id
      slug
    }
  }
`;

export const WorkspaceCreationModal = ({
  initialWorkspaceName,
  isOpen,
  onClose,
}: {
  initialWorkspaceName: string | undefined;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const router = useRouter();
  const [workspaceName, setWorkspaceName] =
    useState<string | undefined>(initialWorkspaceName);
  const slug = slugify(workspaceName ?? "", { lower: true });

  useEffect(() => {
    setWorkspaceName(initialWorkspaceName);
  }, [initialWorkspaceName]);

  // TODO: hardcode the use of the distant client here!
  const { data } = useQuery(searchWorkspacesQuery, {
    skip: workspaceName === undefined,
    variables: { slug },
    fetchPolicy: "network-only",
  });

  // TODO: hardcode the use of the distant client here!
  const [createWorkspace, { error }] = useMutation<{
    createWorkspace: { id: string; slug: string };
  }>(createWorkspaceMutation, {
    variables: { name: workspaceName },
    onCompleted: (createdData) => {
      router.push(`/${createdData.createWorkspace.slug}`);
    },
  });

  const workspaceNameIsAlreadyTaken = data?.workspaces?.length === 1;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior="inside"
      size="3xl"
      isCentered
    >
      <ModalOverlay />
      <ModalContent height="auto">
        <ModalBody
          display="flex"
          p={{ base: "6", lg: "10" }}
          flexDirection="column"
        >
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing="14">
            <Features />
            <Box w="full">
              <Logo
                h="9"
                mb={{ base: "16", lg: "10" }}
                iconColor="brand.600"
                mx={{ base: "auto", lg: "unset" }}
                visibility={{ base: "visible", lg: "hidden" }}
              />
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
              <form onSubmit={(e) => e.preventDefault()}>
                <Stack spacing="1" mb="4">
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    color={mode("gray.800", "gray.200")}
                  >
                    Workspace Name
                  </Text>
                  <Input
                    focusBorderColor={
                      workspaceNameIsAlreadyTaken ? "red.500" : undefined
                    }
                    isInvalid={workspaceNameIsAlreadyTaken}
                    placeholder="My online workspace name"
                    value={workspaceName}
                    onChange={(event) => setWorkspaceName(event.target.value)}
                  />
                  <Message
                    error={error}
                    workspaceName={workspaceName}
                    workspaceNameIsAlreadyTaken={workspaceNameIsAlreadyTaken}
                  />
                </Stack>
                <Button
                  width="full"
                  type="submit"
                  isDisabled={workspaceNameIsAlreadyTaken}
                  colorScheme="brand"
                  onClick={() => createWorkspace()}
                >
                  Create
                </Button>
              </form>
            </Box>
          </SimpleGrid>
        </ModalBody>
        <ModalCloseButton />
      </ModalContent>
    </Modal>
  );
};
