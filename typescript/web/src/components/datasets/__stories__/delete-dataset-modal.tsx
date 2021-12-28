import { Button, useDisclosure } from "@chakra-ui/react";
import {
  apolloDecorator,
  chakraDecorator,
  queryParamsDecorator,
  storybookTitle,
} from "../../../utils/storybook";
import { DeleteDatasetModal } from "../delete-dataset-modal";

export default {
  title: storybookTitle(DeleteDatasetModal),
  decorators: [chakraDecorator, apolloDecorator, queryParamsDecorator],
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
