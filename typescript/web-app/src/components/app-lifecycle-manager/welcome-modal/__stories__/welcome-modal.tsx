import { withNextRouter } from "storybook-addon-next-router";
import { chakraDecorator } from "../../../../utils/chakra-decorator";
import { queryParamsDecorator } from "../../../../utils/query-params-decorator";
import { WelcomeModal } from "../welcome-modal";

export default {
  title: "web-app/app lifecycle/welcome modal",
  decorators: [chakraDecorator, queryParamsDecorator, withNextRouter],
};

export const Default = () => {
  return <WelcomeModal isServiceWorkerActive={false} />;
};

export const Clicked = () => {
  return (
    <WelcomeModal isServiceWorkerActive={false} initiallyHasUserClickedStart />
  );
};
