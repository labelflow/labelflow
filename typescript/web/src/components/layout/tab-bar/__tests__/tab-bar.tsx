import { screen, render } from "@testing-library/react";
import { TabBar, TabBarItem } from "..";

const renderTabBar = (tabs: TabBarItem[]) => {
  render(<TabBar tabs={tabs} />);
};

describe("tab bar", () => {
  beforeEach(() => {});

  it("should not display anything if no tab are passed in the list", () => {
    renderTabBar([]);

    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
  });

  it("should display one tab when there is only one tabs in the list", () => {
    renderTabBar([{ name: "test", url: "some link", isActive: true }]);

    expect(screen.queryByRole("tablist")).toBeInTheDocument();
    expect(screen.getAllByRole("tab")).toHaveLength(1);
    expect(screen.getByText("test")).toBeDefined();
    expect(screen.getByText("test")).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("test")).toHaveAttribute(
      "aria-current",
      "location"
    );
  });

  it("should display an inactive tab", () => {
    renderTabBar([{ name: "test", url: "some link", isActive: false }]);

    expect(screen.getByText("test")).toHaveAttribute("aria-selected", "false");
    expect(screen.getByText("test")).not.toHaveAttribute("aria-current");
  });

  it("should display multiple tabs when there are several in the list", () => {
    renderTabBar([
      { name: "test", url: "some link", isActive: true },
      { name: "test 2", url: "another link", isActive: false },
      { name: "test 3", url: "any link", isActive: false },
    ]);

    expect(screen.getAllByRole("tab")).toHaveLength(3);
  });
});
