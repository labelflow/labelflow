import { chakraDecorator } from "../../../../utils/chakra-decorator";

import { UpdateServiceWorkerModal } from "../update-service-worker-modal";

export default {
  title: "web/app lifecycle/update service worker modal",
  decorators: [chakraDecorator],
};

export const Default = () => {
  return (
    <UpdateServiceWorkerModal isOpen onClose={() => {}} onConfirm={() => {}} />
  );
};
