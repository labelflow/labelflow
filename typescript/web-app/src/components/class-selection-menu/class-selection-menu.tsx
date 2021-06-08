import React from "react";
import { Box, Text, Flex, Button, chakra } from "@chakra-ui/react";
import { HiSelector } from "react-icons/hi";
import { RiCheckboxBlankCircleFill } from "react-icons/ri";
import { LabelClass } from "../../graphql-types.generated";
import { ClassSelectionPopover } from "../class-selection-popover";

const CircleIcon = chakra(RiCheckboxBlankCircleFill);
const SelectorIcon = chakra(HiSelector);

const ClassSelectionButton = React.forwardRef<
  null,
  {
    selectedLabelClass?: LabelClass | null;
    open: () => void;
  }
>(({ selectedLabelClass, open }, ref) => {
  return (
    <Button
      rightIcon={<SelectorIcon fontSize="md" />}
      pl="5"
      pr="5"
      minW="60"
      justifyContent="space-between"
      ref={ref}
      onClick={open}
      bg="white"
    >
      <Flex alignItems="center">
        <CircleIcon
          color={selectedLabelClass?.color ?? "gray.300"}
          fontSize="2xl"
          mr="2"
        />
        <Text>{selectedLabelClass?.name ?? "None"}</Text>
      </Flex>
    </Button>
  );
});

export const ClassSelectionMenu = ({
  labelClasses,
  onSelectedClassChange,
  createNewClass,
  selectedLabelClass,
}: {
  labelClasses: LabelClass[];
  onSelectedClassChange: (item: LabelClass | null) => void;
  createNewClass: (name: string) => void;
  selectedLabelClass?: LabelClass | null;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const open = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  return (
    <Box pl="3" pr="3">
      <ClassSelectionPopover
        isOpen={isOpen}
        labelClasses={labelClasses}
        onSelectedClassChange={(labelClass: LabelClass | null) => {
          onSelectedClassChange(labelClass);
          close();
        }}
        createNewClass={createNewClass}
        selectedLabelClass={selectedLabelClass}
        trigger={
          <ClassSelectionButton
            open={open}
            selectedLabelClass={selectedLabelClass}
          />
        }
      />
    </Box>
  );
};
