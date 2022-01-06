import { useState } from "react";
import { chakraDecorator } from "../../../../utils/chakra-decorator";
import { apolloDecorator } from "../../../../utils/apollo-decorator";

import { SignInModal, SignInModalContext, SignInModalState } from "..";
import { validateEmail } from "../../../../utils/validate-email";

export default {
  title: "web/Signin/Modal",
  decorators: [chakraDecorator, apolloDecorator],
};

const useStory = (linkSent?: string): SignInModalState => {
  const [email, setEmail] = useState("");
  return {
    isOpen: true,
    close: async () => {},
    email,
    setEmail,
    setSendingLink: () => {},
    signIn: async () => {},
    validEmail: validateEmail(email),
    error: undefined,
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
