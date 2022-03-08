import { WorkspacePlan } from "@labelflow/graphql-types";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { WorkspacePlanBadge as WorkspacePlanBadgeComponent } from ".";
import { chakraDecorator, storybookTitle } from "../../utils/stories";

export default {
  title: storybookTitle("Workspaces", WorkspacePlanBadgeComponent),
  component: WorkspacePlanBadgeComponent,
  decorators: [chakraDecorator],
} as ComponentMeta<typeof WorkspacePlanBadgeComponent>;

const Template: ComponentStory<typeof WorkspacePlanBadgeComponent> = (
  props
) => <WorkspacePlanBadgeComponent {...props} />;

export const Community = Template.bind({});
Community.args = { plan: WorkspacePlan.Community };

export const Starter = Template.bind({});
Starter.args = { plan: WorkspacePlan.Starter };

export const Pro = Template.bind({});
Pro.args = { plan: WorkspacePlan.Pro };
