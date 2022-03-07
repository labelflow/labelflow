import { ComponentMeta, Story } from "@storybook/react";
import { chakraDecorator, storybookTitle } from "../../../utils/stories";
import { Pricing as PricingComponent } from ".";

export default {
  title: storybookTitle(PricingComponent),
  component: PricingComponent,
  decorators: [chakraDecorator],
} as ComponentMeta<typeof PricingComponent>;

export const Pricing: Story = () => <PricingComponent />;
