import {
  Box,
  Input,
  InputGroup,
  InputRightElement,
  InputLeftElement,
  Kbd,
  Text,
  Spacer,
  Flex,
  Button,
  chakra,
} from "@chakra-ui/react";
import { useState } from "react";
import { HiSelector } from "react-icons/hi";
import { LabelClass } from "../../graphql-types.generated";
import { ClassSelectionPopover } from "../class-selection-popover";

const SelectorIcon = chakra(HiSelector);

export const ClassSelectionMenu = ({
  labelClasses,
  onSelectedClassChange,
  createNewClass,
}: {
  labelClasses: LabelClass[];
  onSelectedClassChange: (item: LabelClass) => void;
  createNewClass: (name: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Box pl="3" pr="3">
      <Button onClick={toggleOpen} pl="5" pr="5">
        <Flex>
          <Text>Test</Text>
          <Spacer />
          <SelectorIcon fontSize="md" />
        </Flex>
      </Button>
      <ClassSelectionPopover
        isOpen={isOpen}
        labelClasses={labelClasses}
        onSelectedClassChange={onSelectedClassChange}
        createNewClass={createNewClass}
      />
    </Box>
  );
};
