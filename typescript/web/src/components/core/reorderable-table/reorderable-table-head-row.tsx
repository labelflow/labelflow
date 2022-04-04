import { TableRowProps, Td, Tr } from "@chakra-ui/react";

export const ReorderableTableHeadRow = ({
  children,
  ...props
}: TableRowProps) => (
  <Tr {...props}>
    <Td />
    {children}
  </Tr>
);
