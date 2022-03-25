import { Flex } from "@chakra-ui/react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { chakraDecorator, storybookTitle } from "../../utils/stories";
import { KPI_DASHBOARD_URL } from "./kpi-dashboard";
import { MetabaseDashboard as MetabaseDashboardComponent } from "./metabase-dashboard";

export default {
  title: storybookTitle("Metabase", MetabaseDashboardComponent),
  component: MetabaseDashboardComponent,
  decorators: [chakraDecorator],
  parameters: { chromatic: { disableSnapshot: true } },
} as ComponentMeta<typeof MetabaseDashboardComponent>;

const Template: ComponentStory<typeof MetabaseDashboardComponent> = (args) => (
  <Flex direction="column" justify="stretch">
    <MetabaseDashboardComponent {...args} />
  </Flex>
);

export const MetabaseDashboard = Template.bind({});
MetabaseDashboard.args = {
  url: KPI_DASHBOARD_URL,
  title: "Metabase dashboard example",
};
