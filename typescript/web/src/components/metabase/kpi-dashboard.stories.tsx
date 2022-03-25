import { Flex } from "@chakra-ui/react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { chakraDecorator, storybookTitle } from "../../utils/stories";
import { KpiDashboard as KpiDashboardComponent } from "./kpi-dashboard";

export default {
  title: storybookTitle("Metabase", KpiDashboardComponent),
  component: KpiDashboardComponent,
  decorators: [chakraDecorator],
  parameters: { chromatic: { disableSnapshot: true } },
} as ComponentMeta<typeof KpiDashboardComponent>;

const Template: ComponentStory<typeof KpiDashboardComponent> = () => (
  <Flex direction="column" justify="stretch">
    <KpiDashboardComponent />
  </Flex>
);

export const KpiDashboard = Template.bind({});
