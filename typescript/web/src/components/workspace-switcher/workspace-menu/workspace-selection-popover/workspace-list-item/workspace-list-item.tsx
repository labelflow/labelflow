import {
  Avatar,
  Box,
  chakra,
  Flex,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { isEmpty, isNil } from "lodash/fp";
import { RiAddFill, RiGroupFill } from "react-icons/ri";
import { UserWithWorkspacesQuery_user_memberships_workspace } from "../../../../../graphql-types/UserWithWorkspacesQuery";
import { useOptionalWorkspace } from "../../../../../hooks";
import { randomBackgroundGradient } from "../../../../../utils/random-background-gradient";

const TeamIcon = chakra(RiGroupFill);
const AddIcon = chakra(RiAddFill);

export type WorkspaceListItemProps = {
  item:
    | UserWithWorkspacesQuery_user_memberships_workspace
    | { type: "CreateWorkspaceItem"; name?: string; id?: string };
  itemId?: string;
  highlight?: boolean;
  index: number;
  itemProps: any;
  isCreateWorkspaceItem?: boolean;
};

type UseBgColorOptions = Pick<
  WorkspaceListItemProps,
  "isCreateWorkspaceItem" | "highlight"
> & { selected: boolean };

const useBgColors = ({
  selected,
  isCreateWorkspaceItem,
  highlight,
}: UseBgColorOptions): [string, string] => {
  if (selected && !isCreateWorkspaceItem) return ["gray.300", "gray.500"];
  return highlight ? ["gray.100", "gray.600"] : ["transparent", "transparent"];
};

const useBgColor = (options: UseBgColorOptions) =>
  useColorModeValue(...useBgColors(options));

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
  const workspace = useOptionalWorkspace();
  const selected = !isNil(workspace) && itemId === workspace.id;

  const { name } = item;
  const image = "image" in item ? item.image ?? undefined : undefined;

  const bgColor = useBgColor({ highlight, isCreateWorkspaceItem, selected });

  const avatarBorderColor = useColorModeValue("gray.200", "gray.700");
  const avatarBackgroundColor = useColorModeValue("white", "gray.600");
  const avatarBackground = isEmpty(image)
    ? randomBackgroundGradient(name)
    : avatarBackgroundColor;
  const addButtonColor = useColorModeValue("gray.600", "gray.400");

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
              borderColor={avatarBorderColor}
              size="sm"
              rounded="md"
              flexShrink={0}
              flexGrow={0}
              name={name}
              src={image}
              ml="2"
              mr="2"
              color="white"
              bg={avatarBackground}
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
              borderColor={avatarBorderColor}
              size="sm"
              borderRadius="md"
              flexShrink={0}
              flexGrow={0}
              name={name}
              src={image}
              ml="2"
              mr="2"
              color="white"
              bg={avatarBackground}
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
