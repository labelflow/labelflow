import { ComponentMeta, ComponentStory } from "@storybook/react";
import { WORKSPACE_DATA } from "../../../utils/fixtures";
import {
  chakraDecorator,
  CYPRESS_SCREEN_WIDTH,
  MEDIUM_CHROMATIC_VIEWPORT,
  SMALL_CHROMATIC_VIEWPORT,
  storybookTitle,
} from "../../../utils/stories";
import { Billing } from "./billing";
import { WorkspaceSettingsContext } from "./context";

export default {
  title: storybookTitle(Billing),
  component: Billing,
  decorators: [chakraDecorator],
  parameters: {
    viewport: { defaultViewport: "chakraSizesXl" },
    chromatic: {
      viewports: [
        SMALL_CHROMATIC_VIEWPORT,
        MEDIUM_CHROMATIC_VIEWPORT,
        CYPRESS_SCREEN_WIDTH,
      ],
    },
  },
} as ComponentMeta<typeof Billing>;

type TemplateProps = { totalCount: number };

const Template: ComponentStory<(props: TemplateProps) => JSX.Element> = ({
  totalCount,
}) => (
  <WorkspaceSettingsContext.Provider
    value={{
      ...WORKSPACE_DATA,
      imagesAggregates: { totalCount },
      // Required by the Billing page
      stripeCustomerPortalUrl: "",
    }}
  >
    <Billing />
  </WorkspaceSettingsContext.Provider>
);

export const ConsumptionOk = Template.bind({});
ConsumptionOk.args = { totalCount: 123 };

export const ConsumptionWarning = Template.bind({});
ConsumptionWarning.args = { totalCount: 833 };

export const ConsumptionError = Template.bind({});
ConsumptionError.args = { totalCount: 2198 };
