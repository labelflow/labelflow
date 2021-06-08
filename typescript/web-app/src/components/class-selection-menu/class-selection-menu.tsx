import {
  Box,
  Text,
  Flex,
  Button,
  chakra,
  useDisclosure,
} from "@chakra-ui/react";
import { HiSelector } from "react-icons/hi";
import { RiCheckboxBlankCircleFill } from "react-icons/ri";
import { LabelClass } from "../../graphql-types.generated";
import { ClassSelectionPopover } from "../class-selection-popover";

const CircleIcon = chakra(RiCheckboxBlankCircleFill);

const SelectorIcon = chakra(HiSelector);

export const ClassSelectionMenu = ({
  labelClasses,
  onSelectedClassChange,
  createNewClass,
  selectedLabelClass,
}: {
  labelClasses: LabelClass[];
  onSelectedClassChange: (item: LabelClass) => void;
  createNewClass: (name: string) => void;
  selectedLabelClass: LabelClass | null;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const selectedLabelClassName = selectedLabelClass?.name;

  return (
    <Box pl="3" pr="3">
      <Button
        onClick={onOpen}
        rightIcon={<SelectorIcon fontSize="md" />}
        pl="5"
        pr="5"
        minW="60"
        justifyContent="space-between"
        pointerEvents={isOpen ? "none" : "auto"}
        bg="white"
      >
        <Flex alignItems="center">
          <CircleIcon
            color={selectedLabelClass?.color ?? "gray.300"}
            fontSize="2xl"
            mr="2"
          />
          <Text>{selectedLabelClassName ?? "None"}</Text>
        </Flex>
      </Button>
      <ClassSelectionPopover
        isOpen={isOpen}
        onClose={onClose}
        labelClasses={labelClasses}
        onSelectedClassChange={(labelClass: LabelClass) => {
          onSelectedClassChange(labelClass);
          onClose();
        }}
        createNewClass={createNewClass}
        selectedLabelClass={selectedLabelClass}
      />
    </Box>
  );
};
