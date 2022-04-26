import {
  Button,
  ButtonProps,
  chakra,
  Flex,
  HStack,
  Kbd,
  TableCellProps,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { createContext, useCallback, useContext } from "react";
import { RiCheckboxBlankCircleFill } from "react-icons/ri";
import { ReorderableTableCell, ReorderableTableRow } from "../core";
import { useDatasetClasses } from "./dataset-classes.context";
import { LabelClassWithShortcut } from "./types";

export const COMMON_TABLE_CELL_PROPS: TableCellProps = {
  width: "auto",
  whiteSpace: "nowrap",
};

export const COMMON_CLASS_TABLE_CELL_PROPS: TableCellProps = {
  width: "100%",
  maxWidth: "0",
  textOverflow: "ellipsis",
};

const RowContext = createContext({} as LabelClassWithShortcut);

const useRow = () => useContext(RowContext);

const TableCell = (props: TableCellProps) => (
  <ReorderableTableCell {...COMMON_TABLE_CELL_PROPS} {...props} />
);

const CircleIcon = chakra(RiCheckboxBlankCircleFill);

const ColorField = () => {
  const { color } = useRow();
  return (
    <Tooltip label={color} shouldWrapChildren>
      <CircleIcon
        flexShrink={0}
        flexGrow={0}
        color={color}
        fontSize="4xl"
        ml="2"
        mr="2"
      />
    </Tooltip>
  );
};

const NameField = () => {
  const { name } = useRow();
  return (
    <Tooltip label={name}>
      <Text isTruncated>{name}</Text>
    </Tooltip>
  );
};

const ClassCell = () => (
  <TableCell {...COMMON_CLASS_TABLE_CELL_PROPS}>
    <Flex alignItems="center" p={0}>
      <ColorField />
      <NameField />
    </Flex>
  </TableCell>
);

const OccurrencesCell = () => {
  const { labelsAggregates } = useRow();
  return (
    <TableCell alignItems="center">{labelsAggregates.totalCount}</TableCell>
  );
};

const ShortcutCell = () => {
  const { shortcut } = useRow();
  return (
    <TableCell alignItems="center">
      {shortcut && (
        <Kbd flexShrink={0} flexGrow={0} justifyContent="center" mr="1">
          {shortcut}
        </Kbd>
      )}
    </TableCell>
  );
};

const ActionButton = (props: ButtonProps) => (
  <Button variant="link" colorScheme="blue" {...props} />
);

const EditButton = () => {
  const item = useRow();
  const { setEditClass } = useDatasetClasses();
  const handleEdit = useCallback(
    () => setEditClass(item),
    [setEditClass, item]
  );
  return (
    <ActionButton aria-label="Edit class" onClick={handleEdit}>
      Edit
    </ActionButton>
  );
};

const DeleteButton = () => {
  const { id } = useRow();
  const { setDeleteClassId } = useDatasetClasses();
  const handleDelete = useCallback(
    () => setDeleteClassId(id),
    [setDeleteClassId, id]
  );
  return (
    <ActionButton aria-label="Delete class" onClick={handleDelete}>
      Delete
    </ActionButton>
  );
};

const ActionsCell = () => (
  <TableCell alignItems="center">
    <HStack justify="flex-end">
      <EditButton />
      <DeleteButton />
    </HStack>
  </TableCell>
);

const RowBody = () => (
  <>
    <ClassCell />
    <OccurrencesCell />
    <ShortcutCell />
    <ActionsCell />
  </>
);

export const LabelClassesTableRow = (props: LabelClassWithShortcut) => {
  const { id, index } = props;
  return (
    <ReorderableTableRow
      draggableId={id}
      index={index}
      bgColor={useColorModeValue("white", "gray.900")}
    >
      <RowContext.Provider value={props}>
        <RowBody />
      </RowContext.Provider>
    </ReorderableTableRow>
  );
};
