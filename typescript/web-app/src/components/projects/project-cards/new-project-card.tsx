import { Flex, Text, chakra } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";

const PlusIcon = chakra(FaPlus);

export const NewProjectCard = () => {
  // TODO: Update the border style to set custom
  return (
    <Flex
      w="sm"
      h="2xs"
      border="2px"
      borderRadius="16px"
      borderStyle="dashed"
      borderColor="gray.400"
      direction="column"
      alignItems="center"
      justify="space-evenly"
    >
      <PlusIcon color="gray.400" h="60px" w="60" />
      <Text fontSize="16px" fontWeight="semibold" color="gray.500">
        Create new project...
      </Text>
    </Flex>
  );
};
