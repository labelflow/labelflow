import React, { useState, useEffect } from "react";
import { ApolloError, gql, useMutation, useQuery } from "@apollo/client";
import {
  Box,
  Button,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue as mode,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useQueryParam } from "use-query-params";
import slugify from "slugify";
import {
  forbiddenWorkspaceSlugs,
  isValidWorkspaceName,
} from "@labelflow/common-resolvers";

import { Logo } from "../../logo";
import { Features } from "../../auth-manager/signin-modal/features";
import { BoolParam } from "../../../utils/query-param-bool";

export const searchWorkspacesQuery = gql`
  query searchWorkspaces($slug: String!) {
    workspaces(first: 1, where: { slug: $slug }) {
      id
    }
  }
`;

export const createWorkspaceMutation = gql`
  mutation createWorkspace($name: String!) {
    createWorkspace(data: { name: $name }) {
      id
      slug
    }
  }
`;

export const Message = ({
  error,
  workspaceName,
  workspaceNameIsAlreadyTaken,
  isOnlyDisplaying,
}: {
  error: ApolloError | undefined;
  workspaceName: string | undefined;
  workspaceNameIsAlreadyTaken: boolean;
  isOnlyDisplaying?: boolean;
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

  if (workspaceName) {
    if (!isValidWorkspaceName(workspaceName)) {
      return (
        <Text fontSize="sm" color="red.500">
          The name &quot;{workspaceName}&quot; contains invalid characters.
        </Text>
      );
    }

    const slug = slugify(workspaceName, { lower: true });

    if (forbiddenWorkspaceSlugs.includes(slug)) {
      return (
        <Text fontSize="sm" color="red.500">
          The name &quot;{workspaceName}&quot; is already taken
        </Text>
      );
    }

    if (globalThis.location) {
      if (isOnlyDisplaying) {
        return (
          <Text fontSize="sm" color={mode("gray.800", "gray.200")}>
            Your workspace URL: {`${globalThis.location.origin}/${slug}`}
          </Text>
        );
      }
      return (
        <Text fontSize="sm" color={mode("gray.800", "gray.200")}>
          Your URL will be: {`${globalThis.location.origin}/${slug}`}
        </Text>
      );
    }
  }

  return (
    <Text fontSize="sm" visibility="hidden">
      <br />
    </Text>
  );
};

export const WorkspaceCreationModal = ({
  initialWorkspaceName,
  isOpen,
  onClose,
}: {
  initialWorkspaceName?: string | undefined;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const router = useRouter();
  const toast = useToast();
  const setSigninModalOpen = useQueryParam("modal-signin", BoolParam)[1];
  const [workspaceName, setWorkspaceName] =
    useState<string | undefined>(initialWorkspaceName);
  const slug = slugify(workspaceName ?? "", { lower: true });

  useEffect(() => {
    setWorkspaceName(initialWorkspaceName);
  }, [initialWorkspaceName]);

  /**
   * This query and the following mutation need to run against the distant database endpoint;
   * This is currently enforced in the TopBar component.
   */
  const { data } = useQuery(searchWorkspacesQuery, {
    skip: workspaceName === undefined,
    variables: { slug },
    fetchPolicy: "network-only",
  });

  const [createWorkspace, { error }] = useMutation<{
    createWorkspace: { id: string; slug: string };
  }>(createWorkspaceMutation, {
    variables: { name: workspaceName },
    refetchQueries: ["getWorkspaces"],
    onCompleted: (createdData) => {
      router.push(`/${createdData.createWorkspace.slug}`);
    },
    onError: (caughtError: any) => {
      if (caughtError instanceof ApolloError) {
        toast({
          title: "Needs to be signed in",
          description:
            "Only signed-in users can to create and share Workspaces online, please sign in.",
          isClosable: true,
          status: "info",
          position: "bottom-right",
          duration: 10000,
        });
        setSigninModalOpen(true, "replaceIn");
      } else {
        toast({
          title: "Could not create workspace",
          description: caughtError?.message ?? caughtError,
          isClosable: true,
          status: "error",
          position: "bottom-right",
          duration: 10000,
        });
      }
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
                    aria-label="workspace name input"
                    focusBorderColor={
                      workspaceNameIsAlreadyTaken ? "red.500" : undefined
                    }
                    isInvalid={workspaceNameIsAlreadyTaken}
                    placeholder="My online workspace name"
                    value={workspaceName ?? ""}
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
                  isDisabled={
                    workspaceNameIsAlreadyTaken ||
                    slug.length <= 0 ||
                    forbiddenWorkspaceSlugs.includes(slug) ||
                    !isValidWorkspaceName(workspaceName ?? "")
                  }
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
