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
import { ChangeMembershipRole, RemoveMembership, Membership } from "./types";

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
    Cell: function RoleSelectionCell(
      role: any,
      id: string,
      changeMembershipRole: any
    ) {
      return (
        <RoleSelection
          role={role}
          changeMembershipRole={changeMembershipRole}
          id={id}
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
  changeMembershipRole,
  removeMembership,
}: {
  memberships: Membership[];
  changeMembershipRole: ChangeMembershipRole;
  removeMembership: RemoveMembership;
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
        {memberships.map((row, membershipIndex) => (
          <Tr key={membershipIndex}>
            {columns.map((column, index) => {
              const cell = row[column.accessor as keyof typeof row];
              const element =
                column.Cell?.(cell, row.id, changeMembershipRole) ?? cell;
              return (
                <Td whiteSpace="nowrap" key={index}>
                  {element}
                </Td>
              );
            })}
            <Td textAlign="right">
              <Button
                variant="link"
                colorScheme="blue"
                onClick={() => removeMembership(row.id)}
              >
                Remove
              </Button>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
