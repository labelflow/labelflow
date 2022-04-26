import { Button, useDisclosure } from "@chakra-ui/react";
import {
  apolloMockDecorator,
  chakraDecorator,
  CYPRESS_SCREEN_WIDTH,
  fixedScreenDecorator,
  queryParamsDecorator,
  storybookTitle,
} from "../../utils/stories";
import { DeleteDatasetModal } from "./delete-dataset-modal";

export default {
  title: storybookTitle(DeleteDatasetModal),
  decorators: [
    chakraDecorator,
    fixedScreenDecorator,
    apolloMockDecorator,
    queryParamsDecorator,
  ],
  parameters: { chromatic: { viewports: [CYPRESS_SCREEN_WIDTH] } },
};

export const Default = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div>
      <Button onClick={onOpen}>Display</Button>
      <DeleteDatasetModal isOpen={isOpen} onClose={onClose} />
    </div>
  );
};

export const OpenedByDefault = () => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true });

  return (
    <div>
      <Button onClick={onOpen}>Display</Button>
      <DeleteDatasetModal isOpen={isOpen} onClose={onClose} />
    </div>
  );
};
