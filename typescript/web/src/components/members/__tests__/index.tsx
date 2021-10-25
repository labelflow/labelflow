import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Membership,
  MembershipRole,
  WorkspacePlan,
  WorkspaceType,
} from "@labelflow/graphql-types";
import "@testing-library/jest-dom/extend-expect";
import { Members } from "..";

jest.mock("next-auth/react", () => ({
  useSession: () => ({
    data: {},
  }),
}));

const mockedChangeRole = jest.fn();
const mockedRemoveMembership = jest.fn();

const testMemberships: Membership[] = [
  {
    role: MembershipRole.Admin,
    id: "membership1",
    createdAt: "",
    updatedAt: "",
    user: {
      createdAt: "",
      updatedAt: "",
      memberships: [],
      id: "user1",
      image:
        "https://images.unsplash.com/photo-1512485694743-9c9538b4e6e0?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NDN8fGd1eSUyMGZhY2V8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60",
      name: "Marion Watson",
      email: "codyfisher@example.com",
    },
    workspace: {
      createdAt: "",
      updatedAt: "",
      slug: "",
      plan: WorkspacePlan.Community,
      type: WorkspaceType.Online,
      datasets: [],
      memberships: [],

      id: "ws-1",
      name: "My workspace",
    },
  },
  {
    role: MembershipRole.Owner,
    id: "membership2",
    createdAt: "",
    updatedAt: "",
    user: {
      createdAt: "",
      updatedAt: "",
      memberships: [],
      id: "user2",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
      name: "Louise Hopkins",
      email: "jane@example.com",
    },
    workspace: {
      createdAt: "",
      updatedAt: "",
      slug: "",
      plan: WorkspacePlan.Community,
      type: WorkspaceType.Online,
      datasets: [],
      memberships: [],

      id: "ws-1",
      name: "My workspace",
    },
  },
  {
    role: MembershipRole.Admin,
    id: "membership3",
    createdAt: "",
    updatedAt: "",
    user: {
      id: "user3",
      createdAt: "",
      updatedAt: "",
      memberships: [],
      image:
        "https://images.unsplash.com/photo-1470506028280-a011fb34b6f7?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NjN8fGxhZHklMjBmYWNlfGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60",
      name: "Susan Schwartz",
      email: "jenyzx@example.com",
    },
    workspace: {
      createdAt: "",
      updatedAt: "",
      slug: "",
      plan: WorkspacePlan.Community,
      type: WorkspaceType.Online,
      datasets: [],
      memberships: [],

      id: "ws-1",
      name: "My workspace",
    },
  },
  {
    role: MembershipRole.Owner,
    id: "membership4",
    createdAt: "",
    updatedAt: "",
    user: {
      id: "1234567890",
      createdAt: "",
      updatedAt: "",
      memberships: [],
      image:
        "https://images.unsplash.com/photo-1533674689012-136b487b7736?ixid=MXwxMjA3fDB8MHxzZWFyY2h8Mjl8fGFmcmljYSUyMGxhZHklMjBmYWNlfGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60",
    },
    workspace: {
      createdAt: "",
      updatedAt: "",
      slug: "",
      plan: WorkspacePlan.Community,
      type: WorkspaceType.Online,
      datasets: [],
      memberships: [],

      id: "ws-1",
      name: "My workspace",
    },
  },
];

const renderMembersComponent = (memberships: Membership[]): void => {
  render(
    <Members
      memberships={memberships}
      changeMembershipRole={mockedChangeRole}
      removeMembership={mockedRemoveMembership}
    />
  );
};

describe("Workspace members list tests", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("Should render component", () => {
    renderMembersComponent(testMemberships);

    expect(
      screen.queryByText(`Members (${testMemberships.length})`)
    ).toBeDefined();
  });

  test("Should render no rows if no memberships were given", () => {
    renderMembersComponent([]);

    expect(screen.queryByText("Members (0)")).toBeDefined();
  });

  test("Should filter memberships depending on search input", () => {
    renderMembersComponent(testMemberships);
    userEvent.type(
      screen.getByPlaceholderText(/Find a member/i),
      testMemberships[0].user?.name!
    );
    expect(screen.queryByText("Members (1)")).toBeDefined();
    expect(screen.getByText(testMemberships[0].user?.name!)).toBeDefined();
    expect(
      screen.queryByText(testMemberships[1].user?.name!)
    ).not.toBeInTheDocument();
  });

  test("Should call function to change role when clicking role in popover", async () => {
    renderMembersComponent([testMemberships[0]]);
    userEvent.click(screen.getByText(MembershipRole.Admin));
    userEvent.click(screen.getByText(MembershipRole.Owner));
    expect(mockedChangeRole).toHaveBeenCalledWith({
      id: "membership1",
      role: MembershipRole.Owner,
    });
  });

  test("Should give a warning modal when a user tries to remove himself from a workspace where he is the only owner", async () => {
    renderMembersComponent([testMemberships[1]]);
    userEvent.click(screen.getByText("Remove"));
    expect(screen.queryByText(/Cannot remove owner/i)).toBeDefined();
  });

  test("Should call function to delete a membership when clicking on Remove", async () => {
    renderMembersComponent(testMemberships);
    userEvent.click(screen.getAllByText("Remove")[0]);
    expect(screen.queryByText(/Deactivate/i)).toBeDefined();
    userEvent.click(screen.getByText("Deactivate"));
    expect(mockedRemoveMembership).toHaveBeenCalledWith("membership1");
  });
});
