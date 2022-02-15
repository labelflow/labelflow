import { WelcomeModal } from ".";
import {
  apolloMockDecorator,
  cookieDecorator,
  queryParamsDecorator,
  storybookTitle,
} from "../../dev/stories";

export default {
  title: storybookTitle(WelcomeModal),
  decorators: [apolloMockDecorator, queryParamsDecorator, cookieDecorator],
};

export const Closed = () => {
  return <WelcomeModal />;
};

Closed.parameters = {
  nextRouter: {
    path: "/",
    asPath: "/",
    query: {},
  },
  cookie: {
    hasUserTriedApp: "true",
  },
};

export const BrowserError = () => {
  return (
    <WelcomeModal
      initialBrowserError={new Error("Wow")}
      initialBrowserWarning
    />
  );
};

BrowserError.parameters = {
  nextRouter: {
    path: "/?modal-welcome=open",
    asPath: "/?modal-welcome=open",
    query: {
      "modal-welcome": "open",
    },
  },
  cookie: {
    hasUserTriedApp: "false",
  },
};

export const BrowserWarning = () => {
  return <WelcomeModal initialBrowserWarning />;
};

BrowserWarning.parameters = {
  nextRouter: {
    path: "/?modal-welcome=open",
    asPath: "/?modal-welcome=open",
    query: {
      "modal-welcome": "open",
    },
  },
  cookie: {
    hasUserTriedApp: "false",
    tryDespiteBrowserWarning: "false",
  },
};

/**
 * The Welcome Modal displays a countdown.
 * This is non-deterministic, so we can't do snapshot testing here.
 * The next story is the same welcome modal, but without a countdown.
 * So, it's deterministic and can be snapshot tested.
 */
export const Welcome = () => {
  return <WelcomeModal />;
};

Welcome.parameters = {
  chromatic: { disableSnapshot: true },
};

export const WelcomeWithoutCountDown = () => {
  return <WelcomeModal autoStartCountDown={false} />;
};

WelcomeWithoutCountDown.parameters = {
  nextRouter: {
    path: "/?modal-welcome=open",
    asPath: "/?modal-welcome=open",
    query: {
      "modal-welcome": "open",
    },
  },
  cookie: {
    hasUserTriedApp: "false",
    tryDespiteBrowserWarning: "false",
  },
};
