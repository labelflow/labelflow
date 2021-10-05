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

const TeamIcon = chakra(RiGroupFill);
const AddIcon = chakra(RiAddFill);

/**
 * Represent a LabelClass item with its color as
 * an icon on the left with its name and its shortcut
 * on the right. Accounts for the "create new workspace"
 * specific items.
 * @param props
 * @returns
 */
export const WorkspaceListItem = (props: {
  item: { name: string; src?: string };
  highlight?: boolean;
  selected?: boolean;
  index: number;
  itemProps: any;
  isCreateWorkspaceItem?: boolean;
}) => {
  const { item, highlight, selected, index, itemProps, isCreateWorkspaceItem } =
    props;
  const { name, src } = item;

  // arrow function instead of nested ternaries to avoid eslint error
  const bgColor = (() => {
    if (selected && !isCreateWorkspaceItem) {
      return mode("gray.300", "gray.500");
    }
    if (highlight) {
      return mode("gray.100", "gray.600");
    }
    return "transparent";
  })();

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
              borderColor={mode("gray.200", "gray.700")}
              size="sm"
              rounded="lg"
              flexShrink={0}
              flexGrow={0}
              ml="2"
              mr="2"
              bg={mode("white", "gray.900")}
              icon={
                <AddIcon
                  color={mode("gray.600", "gray.400")}
                  fontSize="1.5rem"
                />
              }
            />
            <Text
              whiteSpace="nowrap"
              overflow="hidden"
              fontWeight="light"
              flexShrink={0}
              fontStyle="italic"
            >
              Create workspace&nbsp;
            </Text>
            <Text
              flexGrow={1}
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              fontWeight="bold"
              fontStyle="italic"
            >{`"${name}"`}</Text>
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
              borderColor={mode("gray.200", "gray.700")}
              size="sm"
              rounded="lg"
              flexShrink={0}
              flexGrow={0}
              name={name}
              src={src}
              ml="2"
              mr="2"
              bg={src != null ? mode("white", "gray.900") : "gray.400"}
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
