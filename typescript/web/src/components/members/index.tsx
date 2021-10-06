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
      <TableActions />
      <TableContent
        memberships={memberships}
        changeMembershipRole={changeMembershipRole}
        removeMembership={removeMembership}
      />
    </>
  );
};
