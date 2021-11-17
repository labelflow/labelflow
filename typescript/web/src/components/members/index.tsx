import { useState } from "react";
import { Heading } from "@chakra-ui/react";
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
    <>
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
    </>
  );
};
