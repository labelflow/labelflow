import {
  Box,
  Text,
  Kbd,
  Flex,
  chakra,
  Tooltip,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { RiCheckboxBlankCircleFill } from "react-icons/ri";

const CircleIcon = chakra(RiCheckboxBlankCircleFill);

/**
 * Represent a LabelClass item with its color as
 * an icon on the left with its name and its shortcut
 * on the right. Accounts for the "create new class"
 * specific items.
 * @param props
 * @returns
 */
export const ClassListItem = (props: {
  item: { name: string; type?: string; color?: string; shortcut?: string };
  highlight?: boolean;
  selected?: boolean;
  index: number;
  itemProps: any;
  isCreateClassItem?: boolean;
}) => {
  const { item, highlight, selected, index, itemProps, isCreateClassItem } =
    props;
  const { color, name, shortcut } = item;

  // arrow function instead of nested ternaries to avoid eslint error
  const bgColor = (() => {
    if (selected && !isCreateClassItem) {
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
      aria-current={selected && !isCreateClassItem}
    >
      {isCreateClassItem ? (
        <Tooltip
          placement="right"
          openDelay={300}
          label={`Create class ${name}`}
          aria-label={`Create class ${name}`}
        >
          <Flex justifyContent="space-between" alignItems="center">
            <Text
              whiteSpace="nowrap"
              overflow="hidden"
              fontWeight="light"
              flexShrink={0}
              fontStyle="italic"
              ml="3"
            >
              Create class&nbsp;
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
            <CircleIcon
              flexShrink={0}
              flexGrow={0}
              color={color}
              fontSize="2xl"
              ml="2"
              mr="2"
            />
            <Text
              flexGrow={1}
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
            >
              {name}
            </Text>

            {shortcut && (
              <Kbd flexShrink={0} flexGrow={0} justifyContent="center" mr="2">
                {shortcut}
              </Kbd>
            )}
          </Flex>
        </Tooltip>
      )}
    </Box>
  );
};
