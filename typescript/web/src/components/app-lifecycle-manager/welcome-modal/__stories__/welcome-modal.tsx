import { chakraDecorator } from "../../../../utils/chakra-decorator";
import { queryParamsDecorator } from "../../../../utils/query-params-decorator";
import { WelcomeModal } from "../welcome-modal";

export default {
  title: "web/app lifecycle/welcome modal",
  decorators: [chakraDecorator, queryParamsDecorator],
};

export const Default = () => {
  return <WelcomeModal isServiceWorkerActive={false} />;
};
