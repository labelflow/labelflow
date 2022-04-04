import {
  chakra,
  Flex,
  Table,
  TableColumnHeaderProps,
  Th,
  Thead,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { RiInformationLine } from "react-icons/ri";
import { ReorderableTableBody, ReorderableTableHeadRow } from "../core";
import { useDatasetClasses } from "./dataset-classes.context";
import {
  COMMON_CLASS_TABLE_CELL_PROPS,
  COMMON_TABLE_CELL_PROPS,
  LabelClassesTableRow,
} from "./label-classes-table-row";

const InfoIcon = chakra(RiInformationLine);

const TableHeadCell = (props: TableColumnHeaderProps) => (
  <Th scope="col" {...COMMON_TABLE_CELL_PROPS} {...props} />
);

const ShortcutHeadCell = () => (
  <TableHeadCell>
    <Flex alignItems="center">
      <span>Shortcut</span>
      <Tooltip
        label="A keyboard shortcut is available for the first 10 classes"
        aria-label="A keyboard shortcut is available for the first 10 classes"
        shouldWrapChildren
      >
        <InfoIcon flexShrink={0} flexGrow={0} fontSize="sm" />
      </Tooltip>
    </Flex>
  </TableHeadCell>
);

const TableHead = () => (
  <Thead bg={useColorModeValue("gray.50", "gray.800")}>
    <ReorderableTableHeadRow>
      <TableHeadCell {...COMMON_CLASS_TABLE_CELL_PROPS}>Class</TableHeadCell>
      <TableHeadCell>Occurrences</TableHeadCell>
      <ShortcutHeadCell />
      <TableHeadCell>Actions</TableHeadCell>
    </ReorderableTableHeadRow>
  </Thead>
);

export const TableBody = () => {
  const { labelClasses, onReorder, searchText } = useDatasetClasses();
  const filteredClasses = labelClasses?.filter((labelClass) =>
    labelClass.name.toLowerCase()?.includes(searchText.toLowerCase())
  );
  return (
    <ReorderableTableBody onReorder={onReorder}>
      {(filteredClasses ?? []).map((labelClass, index) => (
        <LabelClassesTableRow
          key={labelClass.id}
          {...labelClass}
          index={index}
        />
      ))}
    </ReorderableTableBody>
  );
};

export const LabelClassesTable = () => (
  <Table maxWidth="5xl" my="8" borderWidth="1px">
    <TableHead />
    <TableBody />
  </Table>
);
