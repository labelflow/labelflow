import {
  chakra,
  Flex,
  TableColumnHeaderProps,
  Th,
  Thead,
  Tooltip,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import React from "react";
import { RiInformationLine } from "react-icons/ri";
import {
  ReorderableTable,
  ReorderableTableBody,
  ReorderableTableHeadRow,
} from "../reorderable-table";
import { LabelClassesTableRow } from "./label-classes-table-row";
import { useLabelClasses } from "./label-classes.context";

const InfoIcon = chakra(RiInformationLine);

const TableHeadCell = (props: TableColumnHeaderProps) => (
  <Th whiteSpace="nowrap" scope="col" {...props} />
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
  <Thead bg={mode("gray.50", "gray.800")}>
    <ReorderableTableHeadRow>
      <TableHeadCell>Class</TableHeadCell>
      <TableHeadCell>Occurrences</TableHeadCell>
      <ShortcutHeadCell />
      <TableHeadCell>Actions</TableHeadCell>
    </ReorderableTableHeadRow>
  </Thead>
);

export const TableBody = () => {
  const { labelClasses, onReorder, searchText } = useLabelClasses();
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
  <ReorderableTable my="8" borderWidth="1px" overflowX="clip">
    <TableHead />
    <TableBody />
  </ReorderableTable>
);
