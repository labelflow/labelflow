import { useState } from "react";

import { HStack, Button, Flex } from "@chakra-ui/react";
import { ClassSelectionMenu } from "../class-selection-menu";
import { chakraDecorator } from "../../../utils/chakra-decorator";
import { LabelClass } from "../../../graphql-types.generated";

export default {
  title: "web-app/Class selection menu",
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

const labelClasses = [
  {
    id: "coaisndoiasndi0",
    createdAt: "today",
    updatedAt: "today",
    name: "SuperUltraLongNameOIANSOINASOINAOSINASOINAOINS",
    color: "#6B7280",
    shortcut: "1",
    labels: [],
  },
  {
    id: "coaisndoiasndi1",
    createdAt: "today",
    updatedAt: "today",
    name: "Dog",
    color: "#EF4444 ",
    shortcut: "2",
    labels: [],
  },
  {
    id: "coaisndoiasndi2",
    createdAt: "today",
    updatedAt: "today",
    name: "Car",
    color: "#F59E0B",
    shortcut: "3",
    labels: [],
  },
  {
    id: "coaisndoiasndi3",
    createdAt: "today",
    updatedAt: "today",
    name: "Cycle",
    color: "#10B981",
    shortcut: "4",
    labels: [],
  },
  {
    id: "coaisndoiasndi4",
    createdAt: "today",
    updatedAt: "today",
    name: "Plane",
    color: "#3B82F6",
    shortcut: "5",
    labels: [],
  },
];

const createNewClass = (name: string): void => {
  alert(`New label class created: ${name}`);
};

export const Default = () => {
  const [selectedLabel, setSelectedLabel] = useState<LabelClass | null>(null);
  return (
    <Template
      labelClasses={labelClasses}
      onSelectedClassChange={(labelClass: LabelClass) =>
        setSelectedLabel(labelClass)
      }
      createNewClass={createNewClass}
      selectedLabelClass={selectedLabel}
    />
  );
};

export const WithSelectedLabelClass = () => {
  const [selectedLabel, setSelectedLabel] = useState<LabelClass | null>(
    labelClasses[0]
  );
  return (
    <Template
      labelClasses={labelClasses}
      onSelectedClassChange={(labelClass: LabelClass) =>
        setSelectedLabel(labelClass)
      }
      createNewClass={createNewClass}
      selectedLabelClass={selectedLabel}
    />
  );
};
