import { ApolloError, gql, useMutation } from "@apollo/client";
import {
  Avatar,
  Box,
  Button,
  chakra,
  HStack,
  SkeletonCircle,
  Stack,
  StackDivider,
  StackProps,
  useColorModeValue as mode,
  useToast,
} from "@chakra-ui/react";
import { Mutation, Workspace } from "@labelflow/graphql-types";
import { useRouter } from "next/router";
import { createContext, useCallback, useContext } from "react";
import { RiGroupFill } from "react-icons/ri";
import { Card, FieldGroup, HeadingGroup } from "..";
import { randomBackgroundGradient } from "../../../utils/random-background-gradient";
import {
  WorkspaceNameInput,
  WorkspaceNameMessage,
} from "../../workspace-switcher/workspace-creation-modal";
import {
  useWorkspaceNameInput,
  WorkspaceNameInputProvider,
} from "../../workspace-switcher/workspace-creation-modal/store";

const TeamIcon = chakra(RiGroupFill);

const WorkspaceProfileContext = createContext<Workspace | undefined>(undefined);

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

function useUpdateWorkspace(): [() => void, string | undefined] {
  const router = useRouter();
  const toast = useToast();
  const workspace = useContext(WorkspaceProfileContext);
  const { name } = useWorkspaceNameInput();
  const [updateWorkspace, { error }] = useMutation<
    Pick<Mutation, "updateWorkspace">
  >(updateWorkspaceMutation, {
    variables: {
      name,
      image: null,
      workspaceSlug: workspace?.slug,
    },
    refetchQueries: ["getWorkspaces"],
    onCompleted: (data) => {
      if (!data?.updateWorkspace) return;
      router.push(`/${data.updateWorkspace.slug}/settings`);
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
  return [updateWorkspace, error?.message];
}

const AvatarInput = () => {
  const workspace = useContext(WorkspaceProfileContext);
  const { name } = useWorkspaceNameInput();
  const avatarBorderColor = mode("gray.200", "gray.700");
  const avatarBackground = mode("white", "gray.700");
  return (
    <>
      {name.length === 0 ? (
        <SkeletonCircle size="10" />
      ) : (
        <Avatar
          borderWidth="1px"
          borderColor={avatarBorderColor}
          color="white"
          borderRadius="md"
          name={name}
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
              : randomBackgroundGradient(name)
          }
          icon={<TeamIcon color="white" fontSize="1rem" />}
        />
      )}
    </>
  );
};

const CancelRenameButton = () => {
  const workspace = useContext(WorkspaceProfileContext);
  const { name, setName } = useWorkspaceNameInput();
  const handleClick = useCallback(
    () => setName(workspace?.name ?? ""),
    [workspace?.name]
  );
  return (
    <Button
      m="1"
      size="sm"
      fontWeight="normal"
      alignSelf="flex-end"
      disabled={name === workspace?.name}
      onClick={handleClick}
    >
      Cancel
    </Button>
  );
};

interface SaveRenameButtonProps {
  onClick: () => void;
}

const SaveRenameButton = ({ onClick }: SaveRenameButtonProps) => {
  const workspace = useContext(WorkspaceProfileContext);
  const { name, isInvalid, workspaceExists } = useWorkspaceNameInput();
  return (
    <Button
      m="1"
      mr="0"
      size="sm"
      alignSelf="flex-end"
      bg="brand.500"
      color="#FFFFFF"
      onClick={onClick}
      disabled={name === workspace?.name || isInvalid || workspaceExists}
    >
      Save Changes
    </Button>
  );
};

const WorkspaceNameAndAvatarBody = () => {
  const workspace = useContext(WorkspaceProfileContext);
  const { name } = useWorkspaceNameInput();
  const isSame = workspace?.name === name;
  const [updateWorkspace, error] = useUpdateWorkspace();
  return (
    <Card>
      <Stack divider={<StackDivider />} spacing="6">
        <FieldGroup
          title="Name &amp; Avatar"
          description="Change workspace public name and image"
        >
          <HStack spacing="4">
            <AvatarInput />
            <Box>
              <WorkspaceNameInput hideInvalid={isSame} />
            </Box>
          </HStack>
        </FieldGroup>
        <WorkspaceNameMessage
          error={error}
          isOnlyDisplaying={isSame}
          hideInvalid={isSame}
        />
        <Box flexDirection="row" alignSelf="flex-end">
          <CancelRenameButton />
          <SaveRenameButton onClick={updateWorkspace} />
        </Box>
      </Stack>
    </Card>
  );
};

const WorkspaceNameAndAvatar = () => {
  const workspace = useContext(WorkspaceProfileContext);
  return (
    <WorkspaceNameInputProvider name={workspace?.name}>
      <WorkspaceNameAndAvatarBody />
    </WorkspaceNameInputProvider>
  );
};

export interface ProfileProps extends StackProps {
  workspace?: Workspace;
}

export const ProfileBody = (props: Omit<ProfileProps, "workspace">) => {
  return (
    <Stack as="section" spacing="6" {...props}>
      <HeadingGroup
        title="Workspace Profile"
        description="Change your workspace public profile"
      />
      <WorkspaceNameAndAvatar />
    </Stack>
  );
};

export const Profile = ({ workspace, ...props }: ProfileProps) => (
  <WorkspaceProfileContext.Provider value={workspace}>
    <ProfileBody {...props} />
  </WorkspaceProfileContext.Provider>
);
