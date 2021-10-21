import { useState, useEffect } from "react";
import { ApolloError, gql, useMutation, useQuery } from "@apollo/client";
import {
  HStack,
  Avatar,
  useColorModeValue as mode,
  Box,
  SkeletonCircle,
  Button,
  Stack,
  chakra,
  StackDivider,
  Input,
  useToast,
} from "@chakra-ui/react";
import slugify from "slugify";
import { RiGroupFill } from "react-icons/ri";
import { useRouter } from "next/router";
import {
  Message,
  searchWorkspacesQuery,
} from "../../workspace-switcher/workspace-creation-modal";
import { randomBackgroundGradient } from "../../../utils/random-background-gradient";
import { FieldGroup, HeadingGroup, Card } from "..";

const TeamIcon = chakra(RiGroupFill);

const updateWorkspaceMutation = gql`
  mutation updateWorkspace(
    $workspaceSlug: String
    $name: String
    $image: String
  ) {
    updateWorkspace(
      where: { slug: $workspaceSlug }
      data: { name: $name, image: $image }
    ) {
      id
      slug
      name
      image
    }
  }
`;

export const Profile = ({
  workspace,
  ...props
}: {
  workspace?: { id: string; name: string; image?: string | null; slug: string };
}) => {
  const router = useRouter();
  const toast = useToast();
  const [workspaceName, setWorkspaceName] = useState(workspace?.name ?? "");

  const slug = slugify(workspaceName, { lower: true });

  const [updateWorkspace, { error }] = useMutation<{
    updateWorkspace: {
      id: string;
      name: string;
      image?: string | null;
      slug: string;
    };
  }>(updateWorkspaceMutation, {
    variables: {
      name: workspaceName !== workspace?.name ? workspaceName : null,
      image: null,
      workspaceSlug: workspace?.slug,
    },
    refetchQueries: ["getWorkspaces"],
    onCompleted: (createdData) => {
      router.push(`/${createdData.updateWorkspace.slug}/settings`);
    },
    onError: (caughtError: any) => {
      if (caughtError instanceof ApolloError) {
        toast({
          title: "Needs to be signed in",
          description:
            "Please sign in first, only signed-in users can create and share Workspaces online.",
          isClosable: true,
          status: "info",
          position: "bottom-right",
          duration: 10000,
        });
      } else {
        toast({
          title: "Could not update workspace",
          description: caughtError?.message ?? caughtError,
          isClosable: true,
          status: "error",
          position: "bottom-right",
          duration: 10000,
        });
      }
    },
  });

  useEffect(() => {
    setWorkspaceName(workspace?.name ?? "");
  }, [workspace?.name ?? ""]);

  /**
   * This query and the following mutation need to run against the distant database endpoint;
   * This is currently enforced in the TopBar component.
   */
  const { data } = useQuery(searchWorkspacesQuery, {
    skip: workspaceName === workspace?.name ?? "",
    variables: { slug },
    fetchPolicy: "network-only",
  });

  const workspaceNameIsAlreadyTaken = data?.workspaces?.length === 1;

  const avatarBorderColor = mode("gray.200", "gray.700");
  const avatarBackground = mode("white", "gray.700");

  return (
    <Stack as="section" spacing="6" {...props}>
      <HeadingGroup
        title="Workspace Profile"
        description="Change your workspace public profile"
      />
      <Card>
        <Stack divider={<StackDivider />} spacing="6">
          <FieldGroup
            title="Name &amp; Avatar"
            description="Change workspace public name and image"
          >
            <HStack spacing="4">
              {workspaceName == null ?? workspaceName === "" ? (
                <SkeletonCircle size="10" />
              ) : (
                <Avatar
                  borderWidth="1px"
                  borderColor={avatarBorderColor}
                  color="white"
                  borderRadius="md"
                  name={workspaceName}
                  src={workspace?.image ?? undefined}
                  mr="2"
                  sx={{
                    "div[role=img]": {
                      fontSize: "32",
                    },
                  }}
                  bg={
                    workspace?.image != null && workspace?.image.length > 0
                      ? avatarBackground
                      : randomBackgroundGradient(workspaceName)
                  }
                  icon={<TeamIcon color="white" fontSize="1rem" />}
                />
              )}
              <Box>
                <Input
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value ?? "")}
                />
              </Box>
            </HStack>
          </FieldGroup>
          <Message
            isOnlyDisplaying={workspaceName === workspace?.name}
            error={error}
            workspaceName={workspaceName}
            workspaceNameIsAlreadyTaken={workspaceNameIsAlreadyTaken}
          />
          <Box flexDirection="row" alignSelf="flex-end">
            <Button
              m="1"
              size="sm"
              fontWeight="normal"
              alignSelf="flex-end"
              disabled={workspaceName === workspace?.name}
              onClick={() => setWorkspaceName(workspace?.name ?? "")}
            >
              Cancel
            </Button>
            <Button
              m="1"
              mr="0"
              size="sm"
              alignSelf="flex-end"
              bg="brand.500"
              color="#FFFFFF"
              onClick={() => updateWorkspace()}
              disabled={workspaceName === workspace?.name}
            >
              Save Changes
            </Button>
          </Box>
        </Stack>
      </Card>
    </Stack>
  );
};
