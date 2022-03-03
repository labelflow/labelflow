import { Button, Flex, HStack } from "@chakra-ui/react";
import { useState } from "react";
import { chakraDecorator, storybookTitle } from "../../../../utils/stories";
import { ClassAdditionMenu, LabelClassItem } from "./class-addition-menu";

export default {
  title: storybookTitle("Labeling tool", ClassAdditionMenu),
  decorators: [chakraDecorator],
};

const Template = (args: any) => (
  <HStack background="gray.100" padding={4} spacing={4}>
    <ClassAdditionMenu {...args} />
    <Button variant="solid" background="white" color="gray.800">
      Button just to compare
    </Button>
    <Flex> </Flex>
  </HStack>
);

const labelClasses: LabelClassItem[] = [
  {
    id: "coaisndoiasndi0",
    name: "SuperUltraLongNameOIANSOINASOINAOSINASOINAOINS",
    color: "#6B7280",
  },
  {
    id: "coaisndoiasndi1",
    name: "Dog",
    color: "#EF4444 ",
  },
  {
    id: "coaisndoiasndi2",
    name: "Car",
    color: "#F59E0B",
  },
  {
    id: "coaisndoiasndi3",
    name: "Cycle",
    color: "#10B981",
  },
  {
    id: "coaisndoiasndi4",
    name: "Plane",
    color: "#3B82F6",
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
