import { Button, useDisclosure } from "@chakra-ui/react";
import { chakraDecorator, storybookTitle } from "../../utils/stories";
import { ClassSelectionPopover } from "./class-selection-popover";

export default {
  title: storybookTitle(ClassSelectionPopover),
  decorators: [chakraDecorator],
};

const labelClasses = [
  {
    id: "coaisndoiasndi0",
    index: 0,
    createdAt: "today",
    updatedAt: "today",
    name: "Person",
    color: "#6B7280",
    shortcut: "1",
    labels: [],
  },
  {
    id: "coaisndoiasndi1",
    index: 0,
    createdAt: "today",
    updatedAt: "today",
    name: "Dog",
    color: "#EF4444 ",
    shortcut: "2",
    labels: [],
  },
  {
    id: "coaisndoiasndi2",
    index: 2,
    createdAt: "today",
    updatedAt: "today",
    name: "Car",
    color: "#F59E0B",
    shortcut: "3",
    labels: [],
  },
  {
    id: "coaisndoiasndi3",
    index: 3,
    createdAt: "today",
    updatedAt: "today",
    name: "Cycle",
    color: "#10B981",
    shortcut: "4",
    labels: [],
  },
  {
    id: "coaisndoiasndi4",
    index: 4,
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
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div>
      <ClassSelectionPopover
        trigger={<Button onClick={onOpen}>Display</Button>}
        isOpen={isOpen}
        onClose={onClose}
        labelClasses={labelClasses}
        onSelectedClassChange={console.log}
        createNewClass={createNewClass}
      />
    </div>
  );
};

export const OpenedByDefault = () => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true });

  return (
    <div>
      <ClassSelectionPopover
        trigger={<Button onClick={onOpen}>Display</Button>}
        isOpen={isOpen}
        onClose={onClose}
        labelClasses={labelClasses}
        onSelectedClassChange={console.log}
        createNewClass={createNewClass}
      />
    </div>
  );
};
