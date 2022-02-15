import { mockWorkspace } from "../../../utils/tests/mock-workspace";

mockWorkspace({ queryParams: { datasetSlug: "test-dataset" } });

import { renderWithTestWrapper } from "../../../utils/tests";
import { TabBar, TabBarItem } from ".";

const renderTabBar = async (tabs: TabBarItem[]) =>
  await renderWithTestWrapper(<TabBar tabs={tabs} />, {
    auth: { withWorkspaces: true },
    apollo: true,
  });

describe(TabBar, () => {
  it("does not display anything if no tab are passed in the list", async () => {
    const { queryByRole } = await renderTabBar([]);
    expect(queryByRole("tablist")).not.toBeInTheDocument();
  });

  it("displays one tab when there is only one tabs in the list", async () => {
    const { getAllByRole, getByText, queryByRole } = await renderTabBar([
      { name: "test", url: "some link", isActive: true },
    ]);
    expect(queryByRole("tablist")).toBeInTheDocument();
    expect(getAllByRole("tab")).toHaveLength(1);
    expect(getByText("test")).toBeDefined();
    expect(getByText("test")).toHaveAttribute("aria-selected", "true");
    expect(getByText("test")).toHaveAttribute("aria-current", "location");
  });

  it("displays an inactive tab", async () => {
    const { getByText } = await renderTabBar([
      { name: "test", url: "some link", isActive: false },
    ]);
    expect(getByText("test")).toHaveAttribute("aria-selected", "false");
    expect(getByText("test")).not.toHaveAttribute("aria-current");
  });

  it("displays multiple tabs when there are several in the list", async () => {
    const { getAllByRole } = await renderTabBar([
      { name: "test", url: "some link", isActive: true },
      { name: "test 2", url: "another link", isActive: false },
      { name: "test 3", url: "any link", isActive: false },
    ]);
    expect(getAllByRole("tab")).toHaveLength(3);
  });
});
