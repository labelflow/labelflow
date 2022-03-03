import { Flex, HStack, Text } from "@chakra-ui/react";
import { v4 as uuid } from "uuid";
import { ComboBoxItemComponent } from ".";
import { Tools } from "../../../connectors/labeling-state";
import { AppIcon, getToolIconName, Icon } from "../icons";

export type ToolDefinition = { id: string; tool: Tools; icon: AppIcon };

export const TestItem: ComboBoxItemComponent<ToolDefinition, "icon"> = ({
  tool,
  icon,
}) => (
  <HStack>
    <Icon name={icon} fontSize="md" />
    <Text>{tool}</Text>
  </HStack>
);

export const TestListItem: ComboBoxItemComponent<ToolDefinition, "icon"> = (
  props
) => {
  const { id } = props;
  return (
    <Flex direction="column" align="left">
      <TestItem {...props} />
      <Text fontSize="xs">{id}</Text>
    </Flex>
  );
};

export const TEST_ITEMS: ToolDefinition[] = Object.values(Tools).map(
  (tool) => ({
    id: uuid(),
    tool,
    icon: getToolIconName(tool),
  })
);
