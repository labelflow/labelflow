import { TableActions } from "./table-actions";
import { TableContent, Membership } from "./table-content";

export const Members = ({ memberships }: { memberships: Membership[] }) => {
  return (
    <>
      <TableActions />
      <TableContent memberships={memberships} />
    </>
  );
};
