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
  useColorModeValue,
  Badge,
  Flex,
} from "@chakra-ui/react";
import { isNil } from "lodash/fp";
import { User } from "./user";
import { RoleSelection } from "./role-selection";
import { ChangeMembershipRole, RemoveMembership } from "./types";
import { DeleteMembershipModal } from "./delete-membership-modal";
import { DeleteMembershipErrorModal } from "./delete-membership-error-modal";
import { GetMembershipsMembersQuery_memberships } from "../../graphql-types/GetMembershipsMembersQuery";
import { MembershipStatus } from "../../graphql-types/globalTypes";

const badgeEnum: Record<string, string> = {
  active: "green",
  sent: "orange",
  declined: "red",
};

const getMembershipStatus = (
  membership: GetMembershipsMembersQuery_memberships
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
    }: GetMembershipsMembersQuery_memberships) {
      return <User email={invitationEmailSentTo} {...userInput} />;
    },
  },
  {
    Header: "Role",
    Cell: function RoleSelectionCell(
      { id, role, workspace }: GetMembershipsMembersQuery_memberships,
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
    Cell: function StatusCell(
      membership: GetMembershipsMembersQuery_memberships
    ) {
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
      { workspace }: GetMembershipsMembersQuery_memberships,
      { deleteMembership }: any
    ) {
      return (
        <Flex justifyContent="flex-end">
          <Tooltip placement="top" label="Remove this user from the workspace">
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
  memberships: GetMembershipsMembersQuery_memberships[];
  changeMembershipRole: ChangeMembershipRole;
  removeMembership: RemoveMembership;
  searchText: string;
}) => {
  const [membershipToDelete, setMembershipToDelete] =
    useState<GetMembershipsMembersQuery_memberships | undefined>(undefined);

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
        isOpen={!isNil(membershipToDelete) && memberships.length > 1}
        membership={membershipToDelete}
        onClose={() => setMembershipToDelete(undefined)}
        deleteMembership={removeMembership}
      />
      <DeleteMembershipErrorModal
        isOpen={!isNil(membershipToDelete) && memberships.length <= 1}
        membership={membershipToDelete}
        onClose={() => setMembershipToDelete(undefined)}
      />
      <Table my="8" borderWidth="1px" fontSize="sm">
        <Thead bg={useColorModeValue("gray.50", "gray.800")}>
          <Tr>
            {columns.map((column, index) => (
              <Th whiteSpace="nowrap" scope="col" key={index}>
                {column.Header}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody bg={useColorModeValue("white", "gray.900")}>
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
