import { useState } from "react";
import { SignIn, SignInContext, SignInState } from ".";
import {
  apolloMockDecorator,
  chakraDecorator,
  storybookTitle,
} from "../../utils/stories";

import { validateEmail } from "../../utils/validate-email";

export default {
  title: storybookTitle(SignIn),
  decorators: [chakraDecorator, apolloMockDecorator],
};
const useStory = (linkSent?: string, error?: string): SignInState => {
  const [email, setEmail] = useState("");
  return {
    email,
    setEmail,
    setSendingLink: () => {},
    signIn: async () => {},
    validEmail: validateEmail(email),
    error,
    linkSent,
    sendingLink: undefined,
    clearQueryParams: async () => {},
  };
};

export const Opened = () => (
  <SignInContext.Provider value={useStory()}>
    <SignIn />
  </SignInContext.Provider>
);

export const LinkSent = () => (
  <SignInContext.Provider value={useStory("example@company.com")}>
    <SignIn />
  </SignInContext.Provider>
);

export const ErrorSigninMethod = () => (
  <SignInContext.Provider value={useStory("", "OAuthAccountNotLinked")}>
    <SignIn />
  </SignInContext.Provider>
);
