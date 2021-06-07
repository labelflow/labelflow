import { useState } from "react";
import { addDecorator } from "@storybook/react";
import { ClassSelectionMenu } from "../class-selection-menu";
import { chakraDecorator } from "../../../utils/chakra-decorator";
import { LabelClass } from "../../../graphql-types.generated";

addDecorator(chakraDecorator);

export default {
  title: "web-app/Class selection menu",
};

const labelClasses = [
  {
    id: "coaisndoiasndi",
    createdAt: "today",
    updatedAt: "today",
    name: "Person",
    color: "#6B7280",
    shortcut: "1",
    labels: [],
  },
  {
    id: "coaisndoiasndi",
    createdAt: "today",
    updatedAt: "today",
    name: "Dog",
    color: "#EF4444 ",
    shortcut: "2",
    labels: [],
  },
  {
    id: "coaisndoiasndi",
    createdAt: "today",
    updatedAt: "today",
    name: "Car",
    color: "#F59E0B",
    shortcut: "3",
    labels: [],
  },
  {
    id: "coaisndoiasndi",
    createdAt: "today",
    updatedAt: "today",
    name: "Cycle",
    color: "#10B981",
    shortcut: "4",
    labels: [],
  },
  {
    id: "coaisndoiasndi",
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
    <ClassSelectionMenu
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
  const [selectedLabel, setSelectedLabel] = useState<LabelClass | null>({
    id: "coaisndoiasndi",
    createdAt: "today",
    updatedAt: "today",
    name: "Plane",
    color: "#3B82F6",
    shortcut: "5",
    labels: [],
  });
  return (
    <ClassSelectionMenu
      labelClasses={labelClasses}
      onSelectedClassChange={(labelClass: LabelClass) =>
        setSelectedLabel(labelClass)
      }
      createNewClass={createNewClass}
      selectedLabelClass={selectedLabel}
    />
  );
};
