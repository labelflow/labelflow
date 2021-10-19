import { useState, useEffect, useCallback } from "react";
import {
  HStack,
  Avatar,
  useColorModeValue as mode,
  Box,
  Button,
  Stack,
  chakra,
  StackDivider,
  Input,
} from "@chakra-ui/react";

import { RiGroupFill } from "react-icons/ri";

import { randomBackgroundGradient } from "../../../utils/random-background-gradient";

import {
  WorkspaceSelectionPopover,
  WorkspaceItem,
} from "./workspace-selection-popover";

import { SettingsContainer, FieldGroup, HeadingGroup, Card } from "..";

const TeamIcon = chakra(RiGroupFill);

export const Profile = ({
  workspace,
  changeName,
  changeImage,
  ...props
}: {
  workspace: { id: string; name?: string; image?: string };
  changeName: (name: string) => void;
  changeImage: (image: string) => void;
}) => {
  const [workspaceName, setWorkspaceName] = useState(workspace?.name);
  const [workspaceImagee, setWorkspaceImage] = useState(workspace?.image);
  useEffect(() => setWorkspaceName(workspace?.name), [workspace]);

  const handleImageUpload = useCallback(() => {}, []);

  const handleSubmit = useCallback(() => {}, []);

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
              <Avatar
                borderWidth="1px"
                borderColor={avatarBorderColor}
                color="white"
                borderRadius="md"
                name={workspace?.name}
                src={workspace?.image}
                mr="2"
                bg={
                  workspace?.image != null && workspace?.image.length > 0
                    ? avatarBackground
                    : randomBackgroundGradient(workspace?.name)
                }
                icon={<TeamIcon color="white" fontSize="1rem" />}
              />

              {/* <Avatar src={workspace?.image} nafme={workspace?.name} /> */}
              <Box>
                <Input
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                />
              </Box>
            </HStack>
          </FieldGroup>
          <Box flexDirection="row" alignSelf="flex-end">
            <Button
              m="1"
              size="sm"
              fontWeight="normal"
              alignSelf="flex-end"
              disabled={workspaceName === workspace?.name}
              onClick={() => setWorkspaceName(workspace?.name)}
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
              onClick={() => changeName(workspaceName)}
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
