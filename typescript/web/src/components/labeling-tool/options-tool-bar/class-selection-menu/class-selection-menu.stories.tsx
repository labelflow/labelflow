import { Button, Flex, HStack } from "@chakra-ui/react";
import { useState } from "react";
import { chakraDecorator, storybookTitle } from "../../../../utils/stories";
import { ClassSelectionMenu, LabelClassItem } from "./class-selection-menu";

export default {
  title: storybookTitle("Labeling tool", ClassSelectionMenu),
  decorators: [chakraDecorator],
};

const Template = (args: any) => (
  <HStack background="gray.100" padding={4} spacing={4}>
    <ClassSelectionMenu {...args} />
    <Button variant="solid" background="white" color="gray.800">
      Button just to compare
    </Button>
    <Flex> </Flex>
  </HStack>
);

const labelClasses: LabelClassItem[] = [
  {
    id: "coaisndoiasndi0",
    index: 0,
    createdAt: "today",
    updatedAt: "today",
    name: "SuperUltraLongNameOIANSOINASOINAOSINASOINAOINS",
    color: "#6B7280",
    labels: [],
  },
  {
    id: "coaisndoiasndi1",
    index: 1,
    createdAt: "today",
    updatedAt: "today",
    name: "Dog",
    color: "#EF4444 ",
    labels: [],
  },
  {
    id: "coaisndoiasndi2",
    index: 2,
    createdAt: "today",
    updatedAt: "today",
    name: "Car",
    color: "#F59E0B",
    labels: [],
  },
  {
    id: "coaisndoiasndi3",
    index: 3,
    createdAt: "today",
    updatedAt: "today",
    name: "Cycle",
    color: "#10B981",
    labels: [],
  },
  {
    id: "coaisndoiasndi4",
    index: 4,
    createdAt: "today",
    updatedAt: "today",
    name: "Plane",
    color: "#3B82F6",
    labels: [],
  },
];

const createNewClass = (name: string): void => {
  alert(`New label class created: ${name}`);
};

export const Default = () => {
  const [selectedLabel, setSelectedLabel] =
    useState<LabelClassItem | null>(null);
  return (
    <Template
      labelClasses={labelClasses}
      onSelectedClassChange={(labelClass: LabelClassItem) =>
        setSelectedLabel(labelClass)
      }
      createNewClass={createNewClass}
      selectedLabelClass={selectedLabel}
    />
  );
};

export const WithSelectedLabelClass = () => {
  const [selectedLabel, setSelectedLabel] = useState<LabelClassItem | null>(
    labelClasses[0]
  );
  return (
    <Template
      labelClasses={labelClasses}
      onSelectedClassChange={(labelClass: LabelClassItem) =>
        setSelectedLabel(labelClass)
      }
      createNewClass={createNewClass}
      selectedLabelClass={selectedLabel}
    />
  );
};
