import {
  Box,
  Text,
  Kbd,
  Flex,
  chakra,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { RiCheckboxBlankCircleFill } from "react-icons/ri";

const CircleIcon = chakra(RiCheckboxBlankCircleFill);

export type ClassListItemProps = {
  item: { name: string; type?: string; color?: string; shortcut?: string };
  highlight?: boolean;
  selected?: boolean;
  index: number;
  itemProps: any;
  isCreateClassItem?: boolean;
};

type UseBgColorOptions = Pick<
  ClassListItemProps,
  "selected" | "isCreateClassItem" | "highlight"
>;

const useBgColorValues = ({
  selected,
  isCreateClassItem,
  highlight,
}: UseBgColorOptions): Parameters<typeof useColorModeValue> => {
  if (selected && !isCreateClassItem) return ["gray.300", "gray.500"];
  return highlight ? ["gray.100", "gray.600"] : ["transparent", "transparent"];
};

const useBgColor = (options: UseBgColorOptions) =>
  useColorModeValue(...useBgColorValues(options));

/**
 * Represent a LabelClass item with its color as
 * an icon on the left with its name and its shortcut
 * on the right. Accounts for the "create new class"
 * specific items.
 */
export const ClassListItem = ({
  item,
  selected,
  index,
  itemProps,
  isCreateClassItem,
  highlight,
}: ClassListItemProps) => {
  const { color, name, shortcut } = item;
  return (
    <Box
      bgColor={useBgColor({ selected, isCreateClassItem, highlight })}
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
