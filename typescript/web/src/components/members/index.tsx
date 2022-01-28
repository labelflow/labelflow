import { useState } from "react";
import { Heading, Box, Center } from "@chakra-ui/react";
import { TableActions } from "./table-actions";
import { TableContent } from "./table-content";
import { RemoveMembership, ChangeMembershipRole, InviteMember } from "./types";
import { InvitationResult } from "../../graphql-types/globalTypes";
import { GetMembershipsMembersQuery_memberships } from "../../graphql-types/GetMembershipsMembersQuery";

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
    <Center>
      <Box
        display="flex"
        flexDirection="column"
        w="full"
        p={8}
        maxWidth="5xl"
        flexGrow={1}
      >
        <Heading mb="5">{`Members (${memberships?.length ?? ""})`}</Heading>
        <TableActions
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
