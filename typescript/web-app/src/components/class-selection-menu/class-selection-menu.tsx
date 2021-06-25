import React from "react";
import { Tooltip, Text, Flex, Button, chakra } from "@chakra-ui/react";
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
    toggle: () => void;
  }
>(({ selectedLabelClass, toggle }, ref) => {
  return (
    <Button
      rightIcon={<SelectorIcon fontSize="md" />}
      minW="60"
      justifyContent="space-between"
      ref={ref}
      onClick={toggle}
      bg="white"
      pointerEvents="initial"
      aria-label="Open class selection popover"
    >
      <Tooltip
        label={`Selected class (${selectedLabelClass?.name ?? "None"})`}
        placement="bottom"
        openDelay={1000}
      >
        <Flex alignItems="center">
          <CircleIcon
            color={selectedLabelClass?.color ?? "gray.300"}
            fontSize="2xl"
            mr="2"
          />
          <Text>{selectedLabelClass?.name ?? "None"}</Text>
        </Flex>
      </Tooltip>
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
  const toggle = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  return (
    <ClassSelectionPopover
      ariaLabel="Class selection menu popover"
      isOpen={isOpen}
      onClose={close}
      labelClasses={labelClasses}
      onSelectedClassChange={(labelClass: LabelClass | null) => {
        onSelectedClassChange(labelClass);
        close();
      }}
      createNewClass={(name: string) => {
        createNewClass(name);
        close();
      }}
      selectedLabelClassId={selectedLabelClass?.id ?? null}
      trigger={
        <ClassSelectionButton
          toggle={toggle}
          selectedLabelClass={selectedLabelClass}
        />
      }
    />
  );
};
