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
    path: "/local/datasets",
    asPath: "/local/datasets",
    query: {},
  },
};

export const WrongBrowser = () => {
  return <WelcomeModal isServiceWorkerActive={false} initialIsWrongBrowser />;
};

WrongBrowser.parameters = {
  nextRouter: {
    path: "/local/datasets?modal-welcome=wrong-browser",
    asPath: "/local/datasets?modal-welcome=wrong-browser",
    query: {
      "modal-welcome": "wrong-browser",
    },
  },
};

export const Welcome = () => {
  return (
    <WelcomeModal
      isServiceWorkerActive={false}
      initialWelcomeModalState="welcome"
    />
  );
};

Welcome.parameters = {
  nextRouter: {
    path: "/local/datasets?modal-welcome=welcome",
    asPath: "/local/datasets?modal-welcome=welcome",
    query: {
      "modal-welcome": "welcome",
    },
  },
};

export const LoadingWorker = () => {
  return (
    <WelcomeModal
      isServiceWorkerActive={false}
      initialWelcomeModalState="loading-worker"
    />
  );
};

LoadingWorker.parameters = {
  nextRouter: {
    path: "/local/datasets?modal-welcome=loading-worker",
    asPath: "/local/datasets?modal-welcome=loading-worker",
    query: {
      "modal-welcome": "loading-worker",
    },
  },
};

export const LoadingDemo = () => {
  return (
    <WelcomeModal
      isServiceWorkerActive={false}
      initialWelcomeModalState="loading-demo"
    />
  );
};

LoadingDemo.parameters = {
  nextRouter: {
    path: "/local/datasets?modal-welcome=loading-demo",
    asPath: "/local/datasets?modal-welcome=loading-demo",
    query: {
      "modal-welcome": "loading-demo",
    },
  },
};

export const LoadingFinished = () => {
  return (
    <WelcomeModal
      isServiceWorkerActive={false}
      initialWelcomeModalState="loading-finished"
    />
  );
};

LoadingFinished.parameters = {
  nextRouter: {
    path: "/local/datasets?modal-welcome=loading-finished",
    asPath: "/local/datasets?modal-welcome=loading-finished",
    query: {
      "modal-welcome": "loading-finished",
    },
  },
};
