import { SessionProvider } from "next-auth/react";
import { Members } from "..";
import {
  apolloMockDecorator,
  chakraDecorator,
  storybookTitle,
} from "../../../utils/stories";
import { TEST_MEMBERSHIPS } from "../members.fixtures";

export default {
  title: storybookTitle(Members),
  component: Members,
  decorators: [chakraDecorator, apolloMockDecorator],
};

export const MembersList = () => {
  return (
    <SessionProvider session={undefined}>
      <Members
        memberships={TEST_MEMBERSHIPS}
        changeMembershipRole={({ id, role }) => {
          console.log(`Will change membership ${id} to ${role}`);
        }}
        removeMembership={(id) => {
          console.log(`Will remove membership with id ${id}`);
        }}
      />
    </SessionProvider>
  );
};

MembersList.parameters = {
  nextRouter: {
    query: {
      workspaceSlug: "local",
    },
  },
};
