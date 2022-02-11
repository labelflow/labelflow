import "@testing-library/jest-dom/extend-expect";
import { RenderResult, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { mockWorkspace } from "../../utils/tests/mock-workspace";

mockWorkspace();

import { MembershipRole } from "../../graphql-types/globalTypes";
import { GetMembershipsMembersQuery_memberships } from "../../graphql-types/GetMembershipsMembersQuery";
import { renderWithTestWrapper } from "../../utils/tests";
import { Members } from ".";
import {
  TEST_MEMBERSHIPS,
  TEST_MEMBERSHIPS_USER_1,
  TEST_MEMBERSHIPS_USER_2,
} from "./members.fixtures";

const mockedChangeRole = jest.fn();
const mockedRemoveMembership = jest.fn();

const renderTest = async (
  memberships: GetMembershipsMembersQuery_memberships[]
) => {
  const result = await renderWithTestWrapper(
    <Members
      memberships={memberships}
      changeMembershipRole={mockedChangeRole}
      removeMembership={mockedRemoveMembership}
    />,
    { auth: { withWorkspaces: true }, apollo: true }
  );
  const { getByTestId } = result;
  await waitFor(() => expect(getByTestId("members")).toBeDefined());
  return result;
};

const waitForTooltipToClose = (queryByText: RenderResult["queryByText"]) =>
  waitFor(() =>
    expect(
      queryByText("Remove this user from the workspace")
    ).not.toBeInTheDocument()
  );

describe(Members, () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders component", async () => {
    const { queryByText } = await renderTest(TEST_MEMBERSHIPS);
    expect(queryByText(`Members (${TEST_MEMBERSHIPS.length})`)).toBeDefined();
  });

  it("renders no rows if no memberships were given", async () => {
    const { queryByText } = await renderTest([]);
    expect(queryByText("Members (0)")).toBeDefined();
  });

  it("filters memberships depending on search input", async () => {
    const { getByText, getByPlaceholderText, queryByText } = await renderTest(
      TEST_MEMBERSHIPS
    );
    userEvent.type(
      getByPlaceholderText(/Find a member/i),
      TEST_MEMBERSHIPS_USER_1.name!
    );
    expect(queryByText("Members (1)")).toBeDefined();
    expect(getByText(TEST_MEMBERSHIPS_USER_1.name)).toBeDefined();
    expect(queryByText(TEST_MEMBERSHIPS_USER_2.name)).not.toBeInTheDocument();
  });

  it("calls function to change role when clicking role in popover", async () => {
    const { getByText } = await renderTest([TEST_MEMBERSHIPS[0]]);
    userEvent.click(getByText(MembershipRole.Admin));
    userEvent.click(getByText(MembershipRole.Owner));
    expect(mockedChangeRole).toHaveBeenCalledWith({
      id: "membership1",
      role: MembershipRole.Owner,
    });
  });

  it("gives a warning modal when a user tries to remove himself from a workspace where he is the only owner", async () => {
    const { getByText, queryByText } = await renderTest([TEST_MEMBERSHIPS[1]]);
    userEvent.click(getByText("Remove"));
    expect(queryByText(/Cannot remove owner/i)).toBeDefined();
    await waitForTooltipToClose(queryByText);
  });

  it("calls function to delete a membership when clicking on Remove", async () => {
    const { getAllByText, getByText, queryByText } = await renderTest(
      TEST_MEMBERSHIPS
    );
    userEvent.click(getAllByText("Remove")[0]);
    expect(queryByText(/Deactivate/i)).toBeDefined();
    userEvent.click(getByText("Deactivate"));
    expect(mockedRemoveMembership).toHaveBeenCalledWith("membership1");
    await waitForTooltipToClose(queryByText);
  });
});
