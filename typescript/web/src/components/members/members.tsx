import { Box, Center, Heading } from "@chakra-ui/react";
import { InvitationResult } from "@labelflow/graphql-types";
import { useState } from "react";
import { GetMembershipsMembersQuery_memberships } from "../../graphql-types/GetMembershipsMembersQuery";
import { MembersTableActions } from "./table-actions";
import { TableContent } from "./table-content";
import { ChangeMembershipRole, InviteMember, RemoveMembership } from "./types";

export const Members = ({
  memberships,
  changeMembershipRole,
  removeMembership,
  inviteMember = async () => InvitationResult.Sent,
}: {
  memberships: GetMembershipsMembersQuery_memberships[];
  changeMembershipRole: ChangeMembershipRole;
  removeMembership: RemoveMembership;
  inviteMember?: InviteMember;
}) => {
  const [searchText, setSearchText] = useState("");
  return (
    <Center data-testid="members">
      <Box
        display="flex"
        flexDirection="column"
        w="full"
        p={8}
        maxWidth="5xl"
        flexGrow={1}
      >
        <Heading mb="5">{`Members (${memberships?.length ?? ""})`}</Heading>
        <MembersTableActions
          searchText={searchText}
          setSearchText={setSearchText}
          inviteMember={inviteMember}
        />
        <TableContent
          memberships={memberships}
          changeMembershipRole={changeMembershipRole}
          removeMembership={removeMembership}
          searchText={searchText}
        />
      </Box>
    </Center>
  );
};
