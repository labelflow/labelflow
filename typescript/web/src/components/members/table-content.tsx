import { useState } from "react";
import {
  Button,
  Tooltip,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue as mode,
  Badge,
  Flex,
} from "@chakra-ui/react";
import { Membership, MembershipStatus } from "@labelflow/graphql-types";
import { User } from "./user";
import { RoleSelection } from "./role-selection";
import { ChangeMembershipRole, RemoveMembership } from "./types";
import { DeleteMembershipModal } from "./delete-membership-modal";
import { DeleteMembershipErrorModal } from "./delete-membership-error-modal";

const badgeEnum: Record<string, string> = {
  active: "green",
  sent: "orange",
  declined: "red",
};

const getMembershipStatus = (
  membership: Membership
): "active" | "sent" | "declined" => {
  switch (membership.status) {
    case MembershipStatus.Active:
      return "active";
    case MembershipStatus.Sent:
      return "sent";
    case MembershipStatus.Declined:
      return "declined";
    default:
      return "sent";
  }
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
      { id, role, workspace }: Membership,
      { changeMembershipRole }: any
    ) {
      return (
        <RoleSelection
          isDisabled={workspace?.slug === "local"}
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
  {
    Header: null,
    Cell: function DeleteCell(
      { workspace }: Membership,
      { deleteMembership }: any
    ) {
      return (
        <Flex justifyContent="flex-end">
          <Tooltip
            placement="top"
            label={
              workspace?.slug === "local"
                ? "You cannot leave your own local workspace"
                : "Remove this user from the workspace"
            }
          >
            {/* This span is needed else the tooltip is not visible when the button is disabled */}
            <span>
              <Button
                isDisabled={workspace?.slug === "local"}
                variant="link"
                colorScheme="blue"
                onClick={deleteMembership}
              >
                Remove
              </Button>
            </span>
          </Tooltip>
        </Flex>
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
          </Tr>
        </Thead>
        <Tbody bg={mode("white", "gray.900")}>
          {filteredMemberships.map((row, membershipIndex) => (
            <Tr key={membershipIndex}>
              {columns.map((column, index) => (
                <Td whiteSpace="nowrap" key={index}>
                  {column.Cell?.(row, {
                    changeMembershipRole,
                    deleteMembership: () => setMembershipToDelete(row),
                  }) ?? row}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
};
