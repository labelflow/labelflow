import {
  Button,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue as mode,
  Badge,
} from "@chakra-ui/react";
import * as React from "react";
import { User } from "./user";
import { RoleSelection } from "./role-selection";

export type Membership = {
  id: string;
  role: string;
  user: {
    id: string;
    name?: string;
    email?: string;
    image?: string;
  };
};

const badgeEnum: Record<string, string> = {
  active: "green",
  reviewing: "orange",
  declined: "red",
};

const columns = [
  {
    Header: "Member",
    accessor: "user",
    Cell: function MemberCell(data: any) {
      return <User data={data} />;
    },
  },
  {
    Header: "Role",
    accessor: "role",
    Cell: function RoleSelectionCell(role: string) {
      return (
        <RoleSelection
          role={role}
          // changeMembershipRole={changeMembershipRole}
        />
      );
    },
  },
  {
    Header: "Status",
    accessor: "status",
    Cell: function StatusCell(data: any) {
      const status = data ?? "active";
      return (
        <Badge fontSize="xs" colorScheme={badgeEnum[status]}>
          {status}
        </Badge>
      );
    },
  },
];

export const TableContent = ({
  memberships,
  changeMembershipRole
}: {
  memberships: Membership[];
  changeMembershipRole:()=>{}
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
          <Th />
        </Tr>
      </Thead>
      <Tbody>
        {memberships.map((row, index) => (
          <Tr key={index}>
            {columns.map((column, index) => {
              const cell = row[column.accessor as keyof typeof row];
              const element = column.Cell?.(cell) ?? cell;
              return (
                <Td whiteSpace="nowrap" key={index}>
                  {element}
                </Td>
              );
            })}
            <Td textAlign="right">
              <Button variant="link" colorScheme="blue">
                Remove
              </Button>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
