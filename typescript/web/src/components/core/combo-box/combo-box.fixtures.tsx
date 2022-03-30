import { Flex, HStack, Text } from "@chakra-ui/react";
import { sentenceCase } from "change-case";
import { ComboBoxItemComponent } from ".";
import { AppIcon, APP_ICONS, Icon, LABELS_ICONS } from "../icons";

export type TestItemDefinition = { id: string; label: string; icon: AppIcon };

export const TestItem: ComboBoxItemComponent<TestItemDefinition, "icon"> = ({
  label,
  icon,
}) => (
  <HStack>
    <Icon name={icon} fontSize="md" />
    <Text>{label}</Text>
  </HStack>
);

export const TestListItem: ComboBoxItemComponent<TestItemDefinition, "icon"> = (
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

const createTestItemDefinition = <TIconName extends AppIcon>(
  iconName: TIconName
): TestItemDefinition => ({
  id: iconName,
  label: sentenceCase(iconName),
  icon: iconName,
});

const createTestItemDefinitions = <TIconName extends AppIcon>(
  icons: Record<TIconName, unknown>
): TestItemDefinition[] =>
  Object.keys(icons).map((icon) => createTestItemDefinition(icon as AppIcon));

export const TEST_ITEMS = createTestItemDefinitions(LABELS_ICONS);

export const TEST_MANY_ITEMS = createTestItemDefinitions(APP_ICONS);
