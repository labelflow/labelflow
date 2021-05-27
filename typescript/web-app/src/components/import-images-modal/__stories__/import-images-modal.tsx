import { addDecorator } from "@storybook/react";
import { Button, useDisclosure } from "@chakra-ui/react";
import { ImportImagesModal } from "../import-images-modal";
import { chakraDecorator } from "../../../utils/chakra-decorator";

addDecorator(chakraDecorator);

export default {
  title: "web-app/Import images modal",
};

export const Default = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div>
      <Button onClick={onOpen}>Display</Button>
      <ImportImagesModal
        isOpen={isOpen}
        onClose={onClose}
        onImportSucceed={() => {}}
      />
    </div>
  );
};

export const OpenedByDefault = () => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true });

  return (
    <div>
      <Button onClick={onOpen}>Display</Button>
      <ImportImagesModal
        isOpen={isOpen}
        onClose={onClose}
        onImportSucceed={() => {}}
      />
    </div>
  );
};
