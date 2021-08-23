import { chakraDecorator } from "../../../../utils/chakra-decorator";
import { queryParamsDecorator } from "../../../../utils/query-params-decorator";
import { apolloDecorator } from "../../../../utils/apollo-decorator";

import { WelcomeModal } from "..";

export default {
  title: "web/app lifecycle/welcome modal",
  decorators: [chakraDecorator, apolloDecorator, queryParamsDecorator],
};

export const Default = () => {
  return <WelcomeModal isServiceWorkerActive={false} />;
};

Default.parameters = {
  nextRouter: {
    path: "/datasets",
    asPath: "/datasets",
    query: {},
  },
};

export const WrongBrowser = () => {
  return <WelcomeModal isServiceWorkerActive={false} />;
};

WrongBrowser.parameters = {
  nextRouter: {
    path: "/datasets?modal-welcome=wrong-browser",
    asPath: "/datasets?modal-welcome=wrong-browser",
    query: {
      "modal-welcome": "wrong-browser",
    },
  },
};

export const Welcome = () => {
  return <WelcomeModal isServiceWorkerActive={false} />;
};

Welcome.parameters = {
  nextRouter: {
    path: "/datasets?modal-welcome=welcome",
    asPath: "/datasets?modal-welcome=welcome",
    query: {
      "modal-welcome": "welcome",
    },
  },
};

export const LoadingWorker = () => {
  return <WelcomeModal isServiceWorkerActive={false} />;
};

LoadingWorker.parameters = {
  nextRouter: {
    path: "/datasets?modal-welcome=loading-worker",
    asPath: "/datasets?modal-welcome=loading-worker",
    query: {
      "modal-welcome": "loading-worker",
    },
  },
};

export const LoadingDemo = () => {
  return <WelcomeModal isServiceWorkerActive={false} />;
};

LoadingDemo.parameters = {
  nextRouter: {
    path: "/datasets?modal-welcome=loading-demo",
    asPath: "/datasets?modal-welcome=loading-demo",
    query: {
      "modal-welcome": "loading-demo",
    },
  },
};
