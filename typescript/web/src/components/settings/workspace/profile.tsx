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
  useColorModeValue,
} from "@chakra-ui/react";
import { isEmpty, isNil } from "lodash/fp";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { RiGroupFill } from "react-icons/ri";
import { Card, FieldGroup, HeadingGroup } from "..";
import {
  UpdateWorkspaceMutation,
  UpdateWorkspaceMutationVariables,
} from "../../../graphql-types/UpdateWorkspaceMutation";
import { USER_WITH_WORKSPACES_QUERY } from "../../../shared-queries/user.query";
import { randomBackgroundGradient } from "../../../utils/random-background-gradient";
import { useApolloError } from "../../error-handlers";
import {
  useWorkspaceNameInput,
  WorkspaceNameInput,
  WorkspaceNameInputProvider,
  WorkspaceNameMessage,
} from "../../workspace-name-input";
import { useWorkspaceSettings } from "./context";

const TeamIcon = chakra(RiGroupFill);

const UPDATE_WORKSPACE_MUTATION = gql`
  mutation UpdateWorkspaceMutation(
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
  const { slug: workspaceSlug } = useWorkspaceSettings();
  const { name } = useWorkspaceNameInput();
  const onError = useApolloError();
  const [updateWorkspace, { error }] = useMutation<
    UpdateWorkspaceMutation,
    UpdateWorkspaceMutationVariables
  >(UPDATE_WORKSPACE_MUTATION, {
    variables: {
      name,
      image: null,
      workspaceSlug,
    },
    refetchQueries: [USER_WITH_WORKSPACES_QUERY],
    onCompleted: (data) => {
      if (!data?.updateWorkspace) return;
      router.push(`/${data.updateWorkspace.slug}/settings`);
    },
    onError,
  });
  return [updateWorkspace, error?.message];
};

const AvatarInput = () => {
  const { image } = useWorkspaceSettings();
  const { name } = useWorkspaceNameInput();
  const avatarBorderColor = useColorModeValue("gray.200", "gray.700");
  const avatarBackground = useColorModeValue("white", "gray.700");
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
          src={image ?? undefined}
          mr="2"
          sx={{
            "div[role=img]": {
              fontSize: "32",
            },
          }}
          bg={
            !isNil(image) && !isEmpty(image)
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
  const { name: workspaceName } = useWorkspaceSettings();
  const { name, setName } = useWorkspaceNameInput();
  const handleClick = useCallback(
    () => setName(workspaceName ?? ""),
    [workspaceName, setName]
  );
  return (
    <Button
      m="1"
      size="sm"
      fontWeight="normal"
      alignSelf="flex-end"
      disabled={name === workspaceName}
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
  const { name: workspaceName } = useWorkspaceSettings();
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
      disabled={name === workspaceName || !isNil(error) || loading}
    >
      Save Changes
    </Button>
  );
};

const WorkspaceNameAndAvatarBody = () => {
  const { name: workspaceName } = useWorkspaceSettings();
  const { name } = useWorkspaceNameInput();
  const isSame = workspaceName === name;
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
  const { name } = useWorkspaceSettings();
  return (
    <WorkspaceNameInputProvider defaultName={name}>
      <WorkspaceNameAndAvatarBody />
    </WorkspaceNameInputProvider>
  );
};

export const Profile = () => (
  <Stack as="section" spacing="6">
    <HeadingGroup
      title="Workspace Profile"
      description="Change your workspace public profile"
    />
    <WorkspaceNameAndAvatar />
  </Stack>
);
