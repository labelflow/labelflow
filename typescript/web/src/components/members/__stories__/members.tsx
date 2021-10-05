import { chakraDecorator } from "../../../utils/chakra-decorator";
import { apolloDecorator } from "../../../utils/apollo-decorator";

import { Members } from "..";

export default {
  title: "web/Workspace members",
  component: Members,
  decorators: [chakraDecorator, apolloDecorator],
};

const memberships = [
  {
    role: "Admin",
    id: "blog",
    user: {
      id: "1",
      image:
        "https://images.unsplash.com/photo-1512485694743-9c9538b4e6e0?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NDN8fGd1eSUyMGZhY2V8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60",
      name: "Marion Watson",
      email: "codyfisher@example.com",
    },
  },
  {
    role: "Owner",
    id: "home",
    user: {
      id: "2",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
      name: "Louise Hopkins",
      email: "jane@example.com",
    },
  },
  {
    role: "Admin",
    id: "design-system",
    user: {
      id: "3",
      image:
        "https://images.unsplash.com/photo-1470506028280-a011fb34b6f7?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NjN8fGxhZHklMjBmYWNlfGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60",
      name: "Susan Schwartz",
      email: "jenyzx@example.com",
    },
  },
  {
    role: "Owner",
    id: "home-2",
    user: {
      id: "4",
      image:
        "https://images.unsplash.com/photo-1533674689012-136b487b7736?ixid=MXwxMjA3fDB8MHxzZWFyY2h8Mjl8fGFmcmljYSUyMGxhZHklMjBmYWNlfGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60",
      name: "Sade Akinlade",
      email: "melyb@example.com",
    },
  },
];

export const MembersList = () => {
  return <Members memberships={memberships} />;
};

MembersList.parameters = {
  nextRouter: {
    query: {
      workspaceSlug: "local",
    },
  },
};
