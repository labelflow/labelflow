import { useState } from "react";
import { Heading } from "@chakra-ui/react";
import { TableActions } from "./table-actions";
import { TableContent } from "./table-content";
import { RemoveMembership, ChangeMembershipRole, Membership } from "./types";

export const Members = ({
  memberships,
  changeMembershipRole,
  removeMembership,
}: {
  memberships: Membership[];
  changeMembershipRole: ChangeMembershipRole;
  removeMembership: RemoveMembership;
}) => {
  const [searchText, setSearchText] = useState("");
  return (
    <>
      <Heading mb="5">{`Members (${memberships?.length ?? ""})`}</Heading>
      <TableActions searchText={searchText} setSearchText={setSearchText} />
      <TableContent
        memberships={memberships}
        changeMembershipRole={changeMembershipRole}
        removeMembership={removeMembership}
        searchText={searchText}
      />
    </>
  );
};
