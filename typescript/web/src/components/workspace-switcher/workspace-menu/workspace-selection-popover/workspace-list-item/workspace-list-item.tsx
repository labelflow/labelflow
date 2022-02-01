import {
  Box,
  Text,
  Flex,
  Avatar,
  chakra,
  Tooltip,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { RiGroupFill, RiAddFill } from "react-icons/ri";
import { UserWorkspacesQuery_workspaces } from "../../../../../graphql-types/UserWorkspacesQuery";
import { useWorkspace } from "../../../../../hooks";
import { randomBackgroundGradient } from "../../../../../utils/random-background-gradient";

const TeamIcon = chakra(RiGroupFill);
const AddIcon = chakra(RiAddFill);

export type WorkspaceListItemProps = {
  item:
    | UserWorkspacesQuery_workspaces
    | { type: "CreateWorkspaceItem"; name?: string; id?: string };
  itemId?: string;
  highlight?: boolean;
  index: number;
  itemProps: any;
  isCreateWorkspaceItem?: boolean;
};

/**
 * Represent a LabelClass item with its color as
 * an icon on the left with its name
 * on the right. Accounts for the "create new workspace"
 * specific items.
 * @param props
 * @returns
 */
export const WorkspaceListItem = ({
  item,
  itemId,
  highlight,
  index,
  itemProps,
  isCreateWorkspaceItem,
}: WorkspaceListItemProps) => {
  const { name } = item;
  const { id: workspaceId } = useWorkspace();
  const selected = itemId === workspaceId;

  // eslint-disable-next-line no-prototype-builtins
  const src = item.hasOwnProperty("src")
    ? (item as { name: string; src?: string }).src
    : undefined;

  // arrow function instead of nested ternaries to avoid eslint error
  const bgColor = (() => {
    if (selected && !isCreateWorkspaceItem) {
      return mode("gray.300", "gray.500");
    }
    if (highlight) {
      return mode("gray.100", "gray.600");
    }
    return mode("transparent", "transparent");
  })();

  const avaterBorderColor = mode("gray.200", "gray.700");
  const avatarBackground = mode("white", "gray.600");
  const addButtonColor = mode("gray.600", "gray.400");

  return (
    <Box
      bgColor={bgColor}
      key={`${name}${index}`}
      {...itemProps}
      pl="3"
      pr="3"
      pt="1"
      pb="1"
      aria-current={selected && !isCreateWorkspaceItem}
    >
      {isCreateWorkspaceItem ? (
        <Tooltip
          placement="right"
          openDelay={300}
          label={`Create workspace ${name}`}
          aria-label={`Create workspace ${name}`}
        >
          <Flex justifyContent="space-between" alignItems="center">
            <Avatar
              borderWidth="1px"
              borderColor={avaterBorderColor}
              size="sm"
              rounded="md"
              flexShrink={0}
              flexGrow={0}
              name={name}
              src={src}
              ml="2"
              mr="2"
              color="white"
              bg={
                src != null && src.length > 0
                  ? avatarBackground
                  : randomBackgroundGradient(name)
              }
              icon={<AddIcon color={addButtonColor} fontSize="1.5rem" />}
            />
            <Text
              whiteSpace="nowrap"
              overflow="hidden"
              fontWeight="light"
              flexShrink={0}
              fontStyle="italic"
            >
              Create workspace
            </Text>
            {(name ?? "")?.length > 0 ? (
              <Text
                flexGrow={1}
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
                fontWeight="bold"
                fontStyle="italic"
              >
                &nbsp;{`"${name}"`}
              </Text>
            ) : (
              <Text
                flexGrow={1}
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
                fontWeight="bold"
                fontStyle="italic"
              >
                &nbsp;
              </Text>
            )}
          </Flex>
        </Tooltip>
      ) : (
        <Tooltip
          placement="right"
          openDelay={300}
          label={name}
          aria-label={name}
        >
          <Flex justifyContent="space-between" alignItems="center">
            <Avatar
              borderWidth="1px"
              borderColor={avaterBorderColor}
              size="sm"
              borderRadius="md"
              flexShrink={0}
              flexGrow={0}
              name={name}
              src={src}
              ml="2"
              mr="2"
              color="white"
              bg={
                src != null && src.length > 0
                  ? avatarBackground
                  : randomBackgroundGradient(name)
              }
              icon={<TeamIcon color="white" fontSize="1rem" />}
            />
            <Text
              flexGrow={1}
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
            >
              {name ?? "Unnamed Workspace"}
            </Text>
          </Flex>
        </Tooltip>
      )}
    </Box>
  );
};
