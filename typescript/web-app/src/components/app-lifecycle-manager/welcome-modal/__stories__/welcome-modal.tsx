import { chakraDecorator } from "../../../../utils/chakra-decorator";

import { WelcomeModal } from "../welcome-modal";

export default {
  title: "web-app/app lifecycle/welcome modal",
  decorators: [chakraDecorator],
};

export const Default = () => {
  return <WelcomeModal isServiceWorkerActive={false} />;
};
