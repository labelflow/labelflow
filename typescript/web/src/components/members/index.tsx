import { TableActions } from "./TableActions";
import { TableContent, Membership } from "./TableContent";

export const Members = ({ memberships }: { memberships: Membership[] }) => {
  return (
    <>
      <TableActions />
      <TableContent memberships={memberships} />
    </>
  );
};
