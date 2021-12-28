import { gql, useMutation } from "@apollo/client";
import {
  Avatar,
  Box,
  Button,
  chakra,
  HStack,
  SkeletonCircle,
  Stack,
  StackDivider,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { Mutation } from "@labelflow/graphql-types";
import { isNil } from "lodash/fp";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { RiGroupFill } from "react-icons/ri";
import { Card, FieldGroup, HeadingGroup } from "..";
import { randomBackgroundGradient } from "../../../utils/random-background-gradient";
import { useApolloErrorToast } from "../../toast";
import {
  useWorkspaceNameInput,
  WorkspaceNameInput,
  WorkspaceNameInputProvider,
  WorkspaceNameMessage,
} from "../../workspace-name-input";
import { useWorkspaceSettings } from "./context";

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

const useUpdateWorkspace = (): [() => void, string | undefined] => {
  const router = useRouter();
  const workspace = useWorkspaceSettings();
  const { name } = useWorkspaceNameInput();
  const onError = useApolloErrorToast();
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
    onError,
  });
  return [updateWorkspace, error?.message];
};

const AvatarInput = () => {
  const workspace = useWorkspaceSettings();
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
  const workspace = useWorkspaceSettings();
  const { name, setName } = useWorkspaceNameInput();
  const handleClick = useCallback(
    () => setName(workspace?.name ?? ""),
    [workspace?.name, setName]
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
  const workspace = useWorkspaceSettings();
  const { name, error, loading } = useWorkspaceNameInput();
  return (
    <Button
      m="1"
      mr="0"
      size="sm"
      alignSelf="flex-end"
      bg="brand.500"
      color="#FFFFFF"
      onClick={onClick}
      disabled={name === workspace?.name || !isNil(error) || loading}
    >
      Save Changes
    </Button>
  );
};

const WorkspaceNameAndAvatarBody = () => {
  const workspace = useWorkspaceSettings();
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
        <WorkspaceNameMessage customError={error} hideError={isSame} />
        <Box flexDirection="row" alignSelf="flex-end">
          <CancelRenameButton />
          <SaveRenameButton onClick={updateWorkspace} />
        </Box>
      </Stack>
    </Card>
  );
};

const WorkspaceNameAndAvatar = () => {
  const workspace = useWorkspaceSettings();
  return (
    <WorkspaceNameInputProvider defaultName={workspace?.name}>
      <WorkspaceNameAndAvatarBody />
    </WorkspaceNameInputProvider>
  );
};

export const Profile = () => {
  return (
    <Stack as="section" spacing="6">
      <HeadingGroup
        title="Workspace Profile"
        description="Change your workspace public profile"
      />
      <WorkspaceNameAndAvatar />
    </Stack>
  );
};
