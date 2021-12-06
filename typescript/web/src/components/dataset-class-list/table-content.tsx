import {
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Kbd,
  useColorModeValue as mode,
} from "@chakra-ui/react";

export type LabelClassWithShortcut = {
  id: string;
  index: number;
  name: string;
  color: string;
  shortcut: string;
};

const columns = [
  {
    Header: "Class",
    Cell: function ClassnameCell({ name }: LabelClassWithShortcut) {
      return <div>{name}</div>;
    },
  },
  {
    Header: "Occurences",
    Cell: function OccurencesCell() {
      return <div>0</div>;
    },
  },
  {
    Header: "Shortcut",
    Cell: function ShortcutCell({ shortcut }: LabelClassWithShortcut) {
      return (
        <Kbd flexShrink={0} flexGrow={0} justifyContent="center" mr="1">
          {shortcut}
        </Kbd>
      );
    },
  },
];

export const ClassTableContent = ({
  classes,
}: {
  classes: LabelClassWithShortcut[];
}) => {
  return (
    <Table my="8" borderWidth="1px" fontSize="sm">
      <Thead bg={mode("gray.50", "gray.800")}>
        <Tr>
          {columns.map((column, index) => (
            <Th whiteSpace="nowrap" scope="col" key={index}>
              {column.Header}
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {classes.map((row, classIndex) => (
          <Tr key={classIndex}>
            {columns.map((column, index) => (
              <Td whiteSpace="nowrap" key={index}>
                {column.Cell?.(row) ?? row}
              </Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
