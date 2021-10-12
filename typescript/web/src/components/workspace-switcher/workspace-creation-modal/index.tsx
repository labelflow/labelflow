import { ApolloError, gql, useMutation, useQuery } from "@apollo/client";
import {
  Box,
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  SimpleGrid,
  Stack,
  Text,
  chakra,
  useColorModeValue as mode,
  Input,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";
import slugify from "slugify";
import { Logo } from "../../logo";

const ChakraCheck = chakra(FaCheck);

const Feature = (props: { title: string; children: React.ReactNode }) => {
  const { title, children } = props;
  return (
    <Stack>
      <Text fontWeight="bold" display="inline-block">
        <ChakraCheck display="inline" color="brand.500" mr="2" />
        {title}
      </Text>
      <Text>{children}</Text>
    </Stack>
  );
};

const CommonPart = () => (
  <Flex
    direction="column"
    display={{ base: "none", lg: "flex" }}
    alignItems="start"
  >
    <Logo
      h="9"
      mb={{ base: "16", lg: "10" }}
      iconColor="brand.600"
      mx={{ base: "auto", lg: "unset" }}
    />
    <Box mb="8" textAlign={{ base: "center", lg: "start" }}>
      <Heading size="md" mb="2" fontWeight="extrabold">
        Join thousands of people building the future of AI
      </Heading>
    </Box>
    <SimpleGrid
      rounded="lg"
      mt="18"
      p={{ base: "10", lg: "0" }}
      columns={1}
      spacing="10"
      bg={{ base: mode("gray.200", "gray.700"), lg: "unset" }}
    >
      <Feature title="Collaborate Easily">
        Invite your teammates to work together on datasets and share your
        results.
      </Feature>
      <Feature title="Secure your Data">
        Your data is stored securely on our servers, no worry about your data
        integrity.
      </Feature>
      <Feature title="Label Faster (soon)">
        Use smart tools based on AI to label your data faster and more
        precisely.
      </Feature>
    </SimpleGrid>
  </Flex>
);

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
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const router = useRouter();
  const [workspaceName, setWorkspaceName] = useState<string | undefined>();
  const slug = slugify(workspaceName ?? "", { lower: true });

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
            <CommonPart />
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
