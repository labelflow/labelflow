import { chakraDecorator } from "../../../utils/chakra-decorator";
import { apolloDecorator } from "../../../utils/apollo-decorator";

import { Members } from "..";
import { SessionProvider } from "next-auth/react";

export default {
  title: "web/Workspace members",
  component: Members,
  decorators: [chakraDecorator, apolloDecorator],
};

const memberships = [
  {
    role: "Admin",
    id: "membership1",
    user: {
      id: "user1",
      image:
        "https://images.unsplash.com/photo-1512485694743-9c9538b4e6e0?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NDN8fGd1eSUyMGZhY2V8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60",
      name: "Marion Watson",
      email: "codyfisher@example.com",
    },
  },
  {
    role: "Owner",
    id: "membership2",
    user: {
      id: "user2",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
      name: "Louise Hopkins",
      email: "jane@example.com",
    },
  },
  {
    role: "Admin",
    id: "membership3",
    user: {
      id: "user3",
      image:
        "https://images.unsplash.com/photo-1470506028280-a011fb34b6f7?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NjN8fGxhZHklMjBmYWNlfGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60",
      name: "Susan Schwartz",
      email: "jenyzx@example.com",
    },
  },
  {
    role: "Owner",
    id: "membership4",
    user: {
      id: "1234567890",
      image:
        "https://images.unsplash.com/photo-1533674689012-136b487b7736?ixid=MXwxMjA3fDB8MHxzZWFyY2h8Mjl8fGFmcmljYSUyMGxhZHklMjBmYWNlfGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60",
    },
  },
];

export const MembersList = () => {
  return (
    <SessionProvider session={undefined}>
      <Members
        memberships={memberships}
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
