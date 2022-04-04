import { Flex } from "@chakra-ui/react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { SearchInput } from ".";
import { chakraDecorator, storybookTitle } from "../../../utils/stories";

export default {
  title: storybookTitle("Core", "SearchInput"),
  component: SearchInput,
  decorators: [chakraDecorator],
} as ComponentMeta<typeof SearchInput>;

const Template: ComponentStory<typeof SearchInput> = (args) => (
  <Flex direction="column" justify="flex-start">
    <SearchInput maxW={300} {...args} />
  </Flex>
);

export const Empty = Template.bind({});
Empty.args = {};

export const WithValue = Template.bind({});
WithValue.args = { value: "Some value" };
