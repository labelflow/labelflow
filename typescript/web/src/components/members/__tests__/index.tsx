import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";

import { mockWorkspace } from "../../../utils/tests/mock-workspace";

mockWorkspace();

import { renderWithWrapper } from "../../../utils/tests";
import { MembershipRole } from "../../../graphql-types/globalTypes";
import { GetMembershipsMembersQuery_memberships } from "../../../graphql-types/GetMembershipsMembersQuery";
import { Members } from "..";
import { TEST_MEMBERSHIPS } from "../members.fixtures";

const mockedChangeRole = jest.fn();
const mockedRemoveMembership = jest.fn();

const renderTest = (memberships: GetMembershipsMembersQuery_memberships[]) =>
  renderWithWrapper(
    <Members
      memberships={memberships}
      changeMembershipRole={mockedChangeRole}
      removeMembership={mockedRemoveMembership}
    />,
    { auth: { withWorkspaces: true }, apollo: true }
  );

describe("Workspace members list tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Should render component", async () => {
    const { queryByText } = await renderTest(TEST_MEMBERSHIPS);
    expect(queryByText(`Members (${TEST_MEMBERSHIPS.length})`)).toBeDefined();
  });

  test("Should render no rows if no memberships were given", async () => {
    const { queryByText } = await renderTest([]);
    expect(queryByText("Members (0)")).toBeDefined();
  });

  test("Should filter memberships depending on search input", async () => {
    const { getByText, getByPlaceholderText, queryByText } = await renderTest(
      TEST_MEMBERSHIPS
    );
    userEvent.type(
      getByPlaceholderText(/Find a member/i),
      TEST_MEMBERSHIPS[0].user?.name!
    );
    expect(queryByText("Members (1)")).toBeDefined();
    expect(getByText(TEST_MEMBERSHIPS[0].user?.name!)).toBeDefined();
    expect(
      queryByText(TEST_MEMBERSHIPS[1].user?.name!)
    ).not.toBeInTheDocument();
  });

  test("Should call function to change role when clicking role in popover", async () => {
    const { getByText } = await renderTest([TEST_MEMBERSHIPS[0]]);
    userEvent.click(getByText(MembershipRole.Admin));
    userEvent.click(getByText(MembershipRole.Owner));
    expect(mockedChangeRole).toHaveBeenCalledWith({
      id: "membership1",
      role: MembershipRole.Owner,
    });
  });

  test("Should give a warning modal when a user tries to remove himself from a workspace where he is the only owner", async () => {
    const { getByText, queryByText } = await renderTest([TEST_MEMBERSHIPS[1]]);
    userEvent.click(getByText("Remove"));
    expect(queryByText(/Cannot remove owner/i)).toBeDefined();
  });

  test("Should call function to delete a membership when clicking on Remove", async () => {
    const { getAllByText, getByText, queryByText } = await renderTest(
      TEST_MEMBERSHIPS
    );
    userEvent.click(getAllByText("Remove")[0]);
    expect(queryByText(/Deactivate/i)).toBeDefined();
    userEvent.click(getByText("Deactivate"));
    expect(mockedRemoveMembership).toHaveBeenCalledWith("membership1");
  });
});
