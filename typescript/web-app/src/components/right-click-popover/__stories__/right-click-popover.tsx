import { addDecorator } from "@storybook/react";
import { Button, useDisclosure } from "@chakra-ui/react";
import { RightClickPopover } from "../right-click-popover";
import { chakraDecorator } from "../../../utils/chakra-decorator";

addDecorator(chakraDecorator);

export default {
  title: "web-app/Right click popover",
};

export const Default = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div>
      <Button onClick={onOpen}>Display</Button>
      <RightClickPopover isOpen={isOpen} onClose={onClose} />
    </div>
  );
};

export const OpenedByDefault = () => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true });

  return (
    <div>
      <Button onClick={onOpen}>Display</Button>
      <RightClickPopover isOpen={isOpen} onClose={onClose} />
    </div>
  );
};
