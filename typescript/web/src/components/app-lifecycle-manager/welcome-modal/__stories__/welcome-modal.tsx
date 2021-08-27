import { chakraDecorator } from "../../../../utils/chakra-decorator";
import { queryParamsDecorator } from "../../../../utils/query-params-decorator";
import { apolloDecorator } from "../../../../utils/apollo-decorator";

import { WelcomeModal } from "..";

export default {
  title: "web/app lifecycle/welcome modal",
  decorators: [chakraDecorator, apolloDecorator, queryParamsDecorator],
};

export const Default = () => {
  return <WelcomeModal />;
};

Default.parameters = {
  nextRouter: {
    path: "/local/datasets",
    asPath: "/local/datasets",
    query: {},
  },
};

export const WrongBrowser = () => {
  return <WelcomeModal initialIsWrongBrowser />;
};

WrongBrowser.parameters = {
  nextRouter: {
    path: "/local/datasets?modal-welcome=open",
    asPath: "/local/datasets?modal-welcome=open",
    query: {
      "modal-welcome": "wrong-browser",
    },
  },
};

export const Welcome = () => {
  return <WelcomeModal />;
};

Welcome.parameters = {
  nextRouter: {
    path: "/local/datasets?modal-welcome=open",
    asPath: "/local/datasets?modal-welcome=open",
    query: {
      "modal-welcome": "welcome",
    },
  },
};

export const LoadingWorker = () => {
  return (
    <WelcomeModal
      initialWelcomeWorkflowState="loading-worker"
      initialHasUserClickedStart
    />
  );
};

LoadingWorker.parameters = {
  nextRouter: {
    path: "/local/datasets?modal-welcome=open",
    asPath: "/local/datasets?modal-welcome=open",
    query: {
      "modal-welcome": "loading-worker",
    },
  },
};

export const LoadingDemo = () => {
  return (
    <WelcomeModal
      initialWelcomeWorkflowState="loading-demo"
      initialHasUserClickedStart
    />
  );
};

LoadingDemo.parameters = {
  nextRouter: {
    path: "/local/datasets?modal-welcome=open",
    asPath: "/local/datasets?modal-welcome=open",
    query: {
      "modal-welcome": "loading-demo",
    },
  },
};

export const LoadingFinished = () => {
  return (
    <WelcomeModal
      initialWelcomeWorkflowState="loading-finished"
      initialHasUserClickedStart
    />
  );
};

LoadingFinished.parameters = {
  nextRouter: {
    path: "/local/datasets?modal-welcome=open",
    asPath: "/local/datasets?modal-welcome=open",
    query: {
      "modal-welcome": "loading-finished",
    },
  },
};
