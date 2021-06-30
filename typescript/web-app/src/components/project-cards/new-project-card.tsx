import { Center, chakra } from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";

const PlusIcon = chakra(FaPlus);

export const NewProjectCard = () => {
  return (
    <Center w="sm" h="44" borderWidth="0px" borderRadius="16px" bg="white">
      <PlusIcon />
    </Center>
  );
};
