import { Fragment } from "react";
import { groupBy } from "lodash/fp";
import { Box, Text, Flex } from "@chakra-ui/react";
import { Keymap } from "../../../../keymap";
import { Shortcut } from "./shortcut";

export const Keys = ({ keys }: { keys: Keymap }) => {
  const categories = groupBy(
    ([, { category }]) => category,
    Object.entries(keys)
  );

  return (
    <Flex direction="column" height="100%" justifyContent="flex-start">
      {Object.entries(categories).map(([category, categoryElements]) => {
        return (
          <Fragment key={category}>
            <Box p="2" bg="gray.200" borderTopRadius="md" w="100%">
              <Text fontWeight="medium">{category}</Text>
            </Box>
            <Flex direction="column" width="100%" pb={8}>
              {Object.entries(categoryElements).map(
                ([, [name, { key, description }]], index) => (
                  <Flex
                    key={name}
                    w="100%"
                    alignItems="center"
                    p={2}
                    pl={6}
                    bg={index % 2 === 0 ? "gray.50" : "inherit"}
                  >
                    <Box
                      pr="2"
                      flexGrow={1}
                      flexShrink={1}
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                    >
                      {description}
                    </Box>
                    <Box
                      whiteSpace="nowrap"
                      flex={0}
                      color="gray.400"
                      fontSize="md"
                      textAlign="right"
                    >
                      <Shortcut keys={key} />
                    </Box>
                  </Flex>
                )
              )}
            </Flex>
          </Fragment>
        );
      })}
    </Flex>
  );
};
