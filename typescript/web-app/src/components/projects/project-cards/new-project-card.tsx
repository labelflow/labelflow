import { Flex, Text, chakra } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import { useQueryParam } from "use-query-params";

import { BoolParam } from "../../../utils/query-param-bool";
import { CreateProjectModal } from "../modal";

const PlusIcon = chakra(FaPlus);

export const NewProjectCard = () => {
  // TODO: Update the border style to set custom dash size

  const [isOpen, setIsOpen] = useQueryParam("modal-create-project", BoolParam);

  // This card is flexible, so its width will depend on the width of its parent
  return (
    <>
      <CreateProjectModal
        isOpen={isOpen ?? false}
        onClose={() => setIsOpen(false, "replaceIn")}
      />

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
        onClick={() => setIsOpen(true, "replaceIn")}
      >
        <PlusIcon color="gray.400" h="60px" w="60" />
        <Text fontSize="16px" fontWeight="semibold" color="gray.500">
          Create new project...
        </Text>
      </Flex>
    </>
  );
};
