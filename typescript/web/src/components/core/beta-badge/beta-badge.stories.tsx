import { Text } from "@chakra-ui/react";
import { Story } from "@storybook/react";
import { BetaBadge as BetaBadgeComponent } from "./beta-badge";
import { chakraDecorator, storybookTitle } from "../../../utils/stories";

export default {
  title: storybookTitle("Core", BetaBadgeComponent),
  component: BetaBadgeComponent,
  decorators: [chakraDecorator],
};

export const BetaBadge: Story = () => (
  <Text>
    An awesome but buggy feature
    <BetaBadgeComponent />
  </Text>
);
