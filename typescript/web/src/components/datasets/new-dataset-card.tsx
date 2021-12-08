import { Flex, Text, chakra, Box } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";

const PlusIcon = chakra(FaPlus);

export const NewDatasetCard = (props: {
  addDataset: () => void;
  disabled?: boolean;
}) => {
  const { addDataset, disabled } = props;

  // This card is flexible, so its width will depend on the width of its parent
  return (
    <Box
      w="100%"
      maxWidth={["100%", "100%", "50%", "33%", "25%"]}
      boxSizing="border-box"
      p={4}
    >
      <Flex
        w="100%"
        h="2xs"
        border="2px"
        borderRadius="16px"
        borderStyle="dashed"
        borderColor="gray.400"
        direction="column"
        alignItems="center"
        justify="space-evenly"
        onClick={addDataset}
        cursor="pointer"
        aria-label={
          disabled ? "please wait before clicking" : "Create new dataset"
        }
      >
        <PlusIcon color="gray.400" h="60px" w="60" />
        <Text fontSize="16px" fontWeight="semibold" color="gray.500">
          Create new dataset...
        </Text>
      </Flex>
    </Box>
  );
};
