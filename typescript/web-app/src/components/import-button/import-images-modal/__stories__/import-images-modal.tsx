import { addDecorator } from "@storybook/react";
import { Button, useDisclosure } from "@chakra-ui/react";
import { ImportImagesModal } from "../import-images-modal";
import { chakraDecorator } from "../../../../utils/chakra-decorator";
import { apolloDecorator } from "../../../../utils/apollo-decorator";
import { queryParamsDecorator } from "../../../../utils/query-params-decorator";

addDecorator(queryParamsDecorator);
addDecorator(chakraDecorator);
addDecorator(apolloDecorator);

export default {
  title: "web-app/Import images modal",
};

export const Default = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div>
      <Button onClick={onOpen}>Display</Button>
      <ImportImagesModal isOpen={isOpen} onClose={onClose} />
    </div>
  );
};

export const OpenedByDefault = () => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true });

  return (
    <div>
      <Button onClick={onOpen}>Display</Button>
      <ImportImagesModal isOpen={isOpen} onClose={onClose} />
    </div>
  );
};
