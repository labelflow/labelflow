import { chakraDecorator } from "../../../../utils/chakra-decorator";
import { apolloDecorator } from "../../../../utils/apollo-decorator";

import { SigninModal } from "..";

export default {
  title: "web/Signin/Modal",
  decorators: [chakraDecorator, apolloDecorator],
};

export const Opened = () => {
  return (
    <SigninModal
      isOpen
      setIsOpen={() => {}}
      setError={() => {}}
      setLinkSent={() => {}}
    />
  );
};

export const LinkSent = () => {
  return (
    <SigninModal
      isOpen
      linkSent="example@company.com"
      setIsOpen={() => {}}
      setError={() => {}}
      setLinkSent={() => {}}
    />
  );
};
