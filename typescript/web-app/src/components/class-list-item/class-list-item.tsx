import { Box, Text, Kbd, Flex, chakra } from "@chakra-ui/react";
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
      return "gray.300";
    }
    if (highlight) {
      return "gray.100";
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
    >
      {isCreateClassItem ? (
        <Flex justifyContent="space-between" alignItems="center">
          <Flex justifyContent="flex-start">
            <Text fontWeight="light" fontStyle="italic" ml="3">
              Create class&nbsp;
            </Text>
            <Text fontWeight="bold" fontStyle="italic">{`"${name}"`}</Text>
          </Flex>
        </Flex>
      ) : (
        <Flex justifyContent="space-between" alignItems="center">
          <Flex alignItems="center">
            <CircleIcon color={color} fontSize="2xl" ml="2" mr="2" />
            <Text>{name}</Text>
          </Flex>
          {shortcut && (
            <Kbd justifyContent="center" mr="2">
              {shortcut}
            </Kbd>
          )}
        </Flex>
      )}
    </Box>
  );
};
