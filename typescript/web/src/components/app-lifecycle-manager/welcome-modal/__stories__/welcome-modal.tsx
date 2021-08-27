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

export const Loading = () => {
  return <WelcomeModal initialHasUserClickedStart />;
};

Loading.parameters = {
  nextRouter: {
    path: "/local/datasets?modal-welcome=open",
    asPath: "/local/datasets?modal-welcome=open",
    query: {
      "modal-welcome": "loading-worker",
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
