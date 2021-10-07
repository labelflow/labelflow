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
  return (
    <>
      <Heading mb="5">{`Members (${memberships?.length ?? ""})`}</Heading>
      <TableActions />
      <TableContent
        memberships={memberships}
        changeMembershipRole={changeMembershipRole}
        removeMembership={removeMembership}
      />
    </>
  );
};
