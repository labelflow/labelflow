import { chakraDecorator, storybookTitle } from "../../../../utils/storybook";
import { UpdateServiceWorkerModal } from "../update-service-worker-modal";

export default {
  title: storybookTitle(UpdateServiceWorkerModal),
  decorators: [chakraDecorator],
};

export const Default = () => {
  return (
    <UpdateServiceWorkerModal isOpen onClose={() => {}} onConfirm={() => {}} />
  );
};
