import { Table, Th, Thead } from "@chakra-ui/react";
import { reorderArray } from "@labelflow/utils";
import { range } from "lodash/fp";
import { useCallback, useState } from "react";
import {
  OnReorderCallback,
  ReorderableTableBody,
  ReorderableTableCell,
  ReorderableTableHeadRow,
  ReorderableTableRow,
} from ".";

export const TEST_DATA = range(0, 10).map((value) => value.toString());

export type TestComponentProps = {
  onReorder?: OnReorderCallback;
};

const useData = (
  onReorder?: OnReorderCallback
): [string[], OnReorderCallback] => {
  const [data, setData] = useState(TEST_DATA);
  const handleReorder = useCallback<OnReorderCallback>(
    (id, source, destination) => {
      const newData = reorderArray(data, source, destination);
      setData(newData);
      onReorder?.(id, source, destination);
    },
    [data, onReorder]
  );
  return [data, handleReorder];
};

export const TestComponent = ({ onReorder }: TestComponentProps) => {
  const [data, handleReorder] = useData(onReorder);
  return (
    <Table variant="striped">
      <Thead>
        <ReorderableTableHeadRow>
          <Th>Value</Th>
        </ReorderableTableHeadRow>
      </Thead>
      <ReorderableTableBody onReorder={handleReorder}>
        {data.map((value, index) => (
          <ReorderableTableRow key={value} draggableId={value} index={index}>
            <ReorderableTableCell>{value}</ReorderableTableCell>
          </ReorderableTableRow>
        ))}
      </ReorderableTableBody>
    </Table>
  );
};
