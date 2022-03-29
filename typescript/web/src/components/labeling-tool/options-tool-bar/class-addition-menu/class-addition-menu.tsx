import React from "react";
import {
  Tooltip,
  Text,
  Flex,
  Button,
  IconButton,
  chakra,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import { HiSelector } from "react-icons/hi";
import { IoMdAddCircleOutline } from "react-icons/io";
import { ClassSelectionPopover } from "../../../class-selection-popover";
import { GetLabelClassesOfDatasetQuery_dataset_labelClasses } from "../../../../graphql-types/GetLabelClassesOfDatasetQuery";

export type LabelClassItem = GetLabelClassesOfDatasetQuery_dataset_labelClasses;

const AddIcon = chakra(IoMdAddCircleOutline);
const SelectorIcon = chakra(HiSelector);

const ClassAdditionButton = React.forwardRef<
  null,
  {
    selectedLabelClass?: LabelClassItem | null;
    toggle: () => void;
  }
>(({ toggle }, ref) => {
  const buttonBg = useColorModeValue("white", "gray.800");
  const largeButton = (
    <Button
      rightIcon={<SelectorIcon fontSize="md" />}
      minW="60"
      justifyContent="space-between"
      ref={ref}
      onClick={toggle}
      bg={buttonBg}
      pointerEvents="initial"
      aria-label="Add a label"
    >
      <Tooltip label="Add a label" placement="bottom" openDelay={1000}>
        <Flex alignItems="center">
          <AddIcon fontSize="xl" mr="2" />
          <Text display={{ base: "none", md: "block" }}>Add a label</Text>
        </Flex>
      </Tooltip>
    </Button>
  );

  const smallButton = (
    <IconButton
      icon={<AddIcon fontSize="2xl" />}
      ref={ref}
      onClick={toggle}
      bg={buttonBg}
      pointerEvents="initial"
      aria-label="Add a label"
    />
  );

  const result =
    useBreakpointValue({
      base: smallButton,
      md: largeButton,
    }) ?? largeButton;
  return result;
});

export const ClassAdditionMenu = ({
  isOpen,
  setIsOpen,
  labelClasses,
  onSelectedClassChange,
  createNewClass,
  selectedLabelClass,
  isContextMenuOpen,
}: {
  isOpen: boolean;
  setIsOpen: (b: boolean) => void;
  labelClasses: LabelClassItem[];
  onSelectedClassChange: (item: LabelClassItem | null) => void;
  createNewClass: (name: string) => void;
  selectedLabelClass?: LabelClassItem | null;
  isContextMenuOpen?: boolean;
}) => {
  const toggle = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  return (
    <ClassSelectionPopover
      ariaLabel="Class addition menu popover"
      isOpen={isOpen}
      onClose={close}
      labelClasses={labelClasses}
      includeNoneClass={false}
      onSelectedClassChange={(labelClass: LabelClassItem | null) => {
        onSelectedClassChange(labelClass);
        close();
      }}
      createNewClass={(name: string) => {
        createNewClass(name);
        close();
      }}
      selectedLabelClassId={selectedLabelClass?.id ?? null}
      trigger={
        <ClassAdditionButton
          toggle={toggle}
          selectedLabelClass={selectedLabelClass}
        />
      }
      activateShortcuts={!isContextMenuOpen}
    />
  );
};
