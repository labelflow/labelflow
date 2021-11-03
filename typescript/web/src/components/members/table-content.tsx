import { useState } from "react";
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
import { Membership } from "@labelflow/graphql-types";
import * as React from "react";
import { User } from "./user";
import { RoleSelection } from "./role-selection";
import { ChangeMembershipRole, RemoveMembership } from "./types";
import { DeleteMembershipModal } from "./delete-membership-modal";
import { DeleteMembershipErrorModal } from "./delete-membership-error-modal";

const badgeEnum: Record<string, string> = {
  active: "green",
  reviewing: "orange",
  declined: "red",
};

const getMembershipStatus = (
  membership: Membership
): "active" | "reviewing" | "declined" => {
  if (membership?.user) {
    return "active";
  }
  if (membership?.invitationToken) {
    return "reviewing";
  }
  return "declined";
};

const columns = [
  {
    Header: "Member",
    Cell: function MemberCell({
      invitationEmailSentTo,
      user: userInput,
    }: Membership) {
      const user = {
        ...{ email: invitationEmailSentTo },
        ...userInput,
      };
      return <User data={user} />;
    },
  },
  {
    Header: "Role",
    Cell: function RoleSelectionCell(
      { id, role }: Membership,
      changeMembershipRole: any
    ) {
      return (
        <RoleSelection
          role={role}
          changeMembershipRole={(newRole) =>
            changeMembershipRole({ role: newRole, id })
          }
        />
      );
    },
  },
  {
    Header: "Status",
    Cell: function StatusCell(membership: Membership) {
      const status = getMembershipStatus(membership);
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
  searchText,
}: {
  memberships: Membership[];
  changeMembershipRole: ChangeMembershipRole;
  removeMembership: RemoveMembership;
  searchText: string;
}) => {
  const [membershipToDelete, setMembershipToDelete] =
    useState<null | Membership>(null);

  const filteredMemberships = memberships.filter(
    (membership) =>
      membership?.user?.email
        ?.toLowerCase()
        ?.includes(searchText.toLowerCase()) ||
      membership?.user?.name
        ?.toLowerCase()
        ?.includes(searchText.toLowerCase()) ||
      membership?.user?.id?.toLowerCase()?.includes(searchText.toLowerCase()) ||
      membership?.invitationEmailSentTo
        ?.toLowerCase()
        ?.includes(searchText.toLowerCase())
  );
  return (
    <>
      <DeleteMembershipModal
        isOpen={membershipToDelete != null && memberships.length > 1}
        membership={membershipToDelete}
        onClose={() => setMembershipToDelete(null)}
        deleteMembership={removeMembership}
      />
      <DeleteMembershipErrorModal
        isOpen={membershipToDelete != null && memberships.length <= 1}
        membership={membershipToDelete}
        onClose={() => setMembershipToDelete(null)}
      />
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
        <Tbody bgColor="#FFFFFF">
          {filteredMemberships.map((row, membershipIndex) => (
            <Tr key={membershipIndex}>
              {columns.map((column, index) => {
                const element = column.Cell?.(row, changeMembershipRole) ?? row;
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
                  onClick={() => setMembershipToDelete(row)}
                >
                  Remove
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
};
