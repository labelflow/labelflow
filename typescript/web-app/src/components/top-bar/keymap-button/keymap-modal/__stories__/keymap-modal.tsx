import { addDecorator } from "@storybook/react";
import { Button, useDisclosure } from "@chakra-ui/react";
import { KeymapModal } from "../keymap-modal";
import { chakraDecorator } from "../../../../../utils/chakra-decorator";
import { apolloDecorator } from "../../../../../utils/apollo-decorator";

addDecorator(chakraDecorator);
addDecorator(apolloDecorator);

export default {
  title: "web-app/Keymap modal",
};

export const Default = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div>
      <Button onClick={onOpen}>Display</Button>
      <KeymapModal isOpen={isOpen} onClose={onClose} />
    </div>
  );
};

export const OpenedByDefault = () => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true });

  return (
    <div>
      <Button onClick={onOpen}>Display</Button>
      <KeymapModal isOpen={isOpen} onClose={onClose} />
    </div>
  );
};
