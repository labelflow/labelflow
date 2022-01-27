import { useState } from "react";
import { SignInModal, SignInModalContext, SignInModalState } from "..";
import { validateEmail } from "../../../../utils/validate-email";
import {
  apolloMockDecorator,
  chakraDecorator,
  storybookTitle,
} from "../../../../utils/stories";

export default {
  title: storybookTitle(SignInModal),
  decorators: [chakraDecorator, apolloMockDecorator],
};
const useStory = (linkSent?: string, error?: string): SignInModalState => {
  const [email, setEmail] = useState("");
  return {
    isOpen: true,
    close: async () => {},
    email,
    setEmail,
    setSendingLink: () => {},
    signIn: async () => {},
    validEmail: validateEmail(email),
    error,
    linkSent,
    sendingLink: undefined,
  };
};

export const Opened = () => (
  <SignInModalContext.Provider value={useStory()}>
    <SignInModal />
  </SignInModalContext.Provider>
);

export const LinkSent = () => (
  <SignInModalContext.Provider value={useStory("example@company.com")}>
    <SignInModal />
  </SignInModalContext.Provider>
);

export const ErrorSigninMethod = () => (
  <SignInModalContext.Provider value={useStory("", "OAuthAccountNotLinked")}>
    <SignInModal />
  </SignInModalContext.Provider>
);
