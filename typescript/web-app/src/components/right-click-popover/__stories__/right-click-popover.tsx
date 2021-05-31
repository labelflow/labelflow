import { addDecorator } from "@storybook/react";
import { Button, useDisclosure } from "@chakra-ui/react";
import { RightClickPopover } from "../right-click-popover";
import { chakraDecorator } from "../../../utils/chakra-decorator";

addDecorator(chakraDecorator);

export default {
  title: "web-app/Right click popover",
};

const labelClasses = [
  { name: "Person", color: "#7E5ACB", shortcut: "1" },
  { name: "Dog", color: "#4F5797 ", shortcut: "2" },
  { name: "Car", color: "#C0B55E", shortcut: "3" },
  { name: "Cycle", color: "#56FDCC", shortcut: "4" },
  { name: "Plane", color: "#0E6AD3", shortcut: "5" },
];

const createNewClass = (name: string): void => {
  alert(`New label class created: ${name}`);
};

export const Default = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div>
      <Button onClick={onOpen}>Display</Button>
      <RightClickPopover
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
      <Button onClick={onOpen}>Display</Button>
      <RightClickPopover
        isOpen={isOpen}
        onClose={onClose}
        labelClasses={labelClasses}
        onSelectedClassChange={console.log}
        createNewClass={createNewClass}
      />
    </div>
  );
};
