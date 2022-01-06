import { useState } from "react";
import { Heading, Box, Center } from "@chakra-ui/react";
import { InvitationResult, Membership } from "@labelflow/graphql-types";
import { TableActions } from "./table-actions";
import { TableContent } from "./table-content";
import { RemoveMembership, ChangeMembershipRole, InviteMember } from "./types";

export const Members = ({
  memberships,
  changeMembershipRole,
  removeMembership,
  inviteMember = async () => InvitationResult.Sent,
}: {
  memberships: Membership[];
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
