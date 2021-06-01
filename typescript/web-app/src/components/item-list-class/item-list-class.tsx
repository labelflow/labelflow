import { Box, Text, Kbd, Flex } from "@chakra-ui/react";

import { RiCheckboxBlankCircleFill } from "react-icons/ri";

/**
 * Represent a LabelClass item with its color as
 * an icon on the left with its name and its shortcut
 * on the right. Accounts for the "create new class"
 * specific items.
 * @param props
 * @returns
 */
export const ItemListClass = (props: {
  item: any;
  highlight: boolean;
  index: number;
  itemProps: any;
}) => {
  const { item, highlight, index, itemProps } = props;
  const { type, color, name, shortcut } = item;

  return (
    <Box
      style={{
        marginLeft: "-13px",
        marginRight: "-13px",
      }}
      bgColor={highlight ? "gray.100" : "transparent"}
      key={`${name}${index}`}
      {...itemProps}
    >
      {type === "CreateClassItem" ? (
        <Flex
          justifyContent="space-between"
          alignItems="center"
          style={{ marginLeft: "25px", marginRight: "23px" }}
          height="35px"
        >
          <Flex justifyContent="flex-start">
            <Text fontWeight="light" fontStyle="italic">
              Create class&nbsp;
            </Text>
            <Text fontWeight="bold" fontStyle="italic">{`“${name}”`}</Text>
          </Flex>
        </Flex>
      ) : (
        <Flex
          justifyContent="space-between"
          alignItems="center"
          style={{ marginLeft: "25px", marginRight: "23px" }}
          height="35px"
        >
          <Flex alignItems="center">
            <RiCheckboxBlankCircleFill
              color={color}
              style={{ marginRight: 5 }}
              size="25px"
            />
            <Text>{name}</Text>
          </Flex>
          <Kbd style={{ justifyContent: "center" }}>{shortcut}</Kbd>
        </Flex>
      )}
    </Box>
  );
};
