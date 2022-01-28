import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import { Members } from "..";
import { TEST_MEMBERSHIPS } from "../members.fixtures";
import { GetMembershipsMembersQuery_memberships } from "../../../graphql-types/GetMembershipsMembersQuery";
import { MembershipRole } from "../../../graphql-types/globalTypes";

jest.mock("next-auth/react", () => ({
  useSession: () => ({
    data: {},
  }),
}));

const mockedChangeRole = jest.fn();
const mockedRemoveMembership = jest.fn();

const renderMembersComponent = (
  memberships: GetMembershipsMembersQuery_memberships[]
): void => {
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
    renderMembersComponent(TEST_MEMBERSHIPS);

    expect(
      screen.queryByText(`Members (${TEST_MEMBERSHIPS.length})`)
    ).toBeDefined();
  });

  test("Should render no rows if no memberships were given", () => {
    renderMembersComponent([]);

    expect(screen.queryByText("Members (0)")).toBeDefined();
  });

  test("Should filter memberships depending on search input", () => {
    renderMembersComponent(TEST_MEMBERSHIPS);
    userEvent.type(
      screen.getByPlaceholderText(/Find a member/i),
      TEST_MEMBERSHIPS[0].user?.name!
    );
    expect(screen.queryByText("Members (1)")).toBeDefined();
    expect(screen.getByText(TEST_MEMBERSHIPS[0].user?.name!)).toBeDefined();
    expect(
      screen.queryByText(TEST_MEMBERSHIPS[1].user?.name!)
    ).not.toBeInTheDocument();
  });

  test("Should call function to change role when clicking role in popover", async () => {
    renderMembersComponent([TEST_MEMBERSHIPS[0]]);
    userEvent.click(screen.getByText(MembershipRole.Admin));
    userEvent.click(screen.getByText(MembershipRole.Owner));
    expect(mockedChangeRole).toHaveBeenCalledWith({
      id: "membership1",
      role: MembershipRole.Owner,
    });
  });

  test("Should give a warning modal when a user tries to remove himself from a workspace where he is the only owner", async () => {
    renderMembersComponent([TEST_MEMBERSHIPS[1]]);
    userEvent.click(screen.getByText("Remove"));
    expect(screen.queryByText(/Cannot remove owner/i)).toBeDefined();
  });

  test("Should call function to delete a membership when clicking on Remove", async () => {
    renderMembersComponent(TEST_MEMBERSHIPS);
    userEvent.click(screen.getAllByText("Remove")[0]);
    expect(screen.queryByText(/Deactivate/i)).toBeDefined();
    userEvent.click(screen.getByText("Deactivate"));
    expect(mockedRemoveMembership).toHaveBeenCalledWith("membership1");
  });
});
