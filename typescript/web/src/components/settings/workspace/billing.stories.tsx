import { Story } from "@storybook/react";
import { WORKSPACE_DATA } from "../../../utils/fixtures";
import { chakraDecorator, storybookTitle } from "../../../utils/stories";
import { Billing } from "./billing";
import { WorkspaceSettingsContext } from "./context";

export default {
  title: storybookTitle("Plan consumption"),
  decorators: [chakraDecorator],
};

const TestComponent = ({ totalCount }: { totalCount: number }) => (
  <WorkspaceSettingsContext.Provider
    value={{
      ...WORKSPACE_DATA,
      imagesAggregates: { totalCount },
      stripeCustomerPortalUrl: "",
    }}
  >
    <Billing />
  </WorkspaceSettingsContext.Provider>
);

export const ConsumptionOk: Story = () => <TestComponent totalCount={123} />;
export const ConsumptionWarning: Story = () => (
  <TestComponent totalCount={833} />
);
export const ConsumptionError: Story = () => (
  <TestComponent totalCount={2198} />
);
