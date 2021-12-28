import { SigninModal } from "..";
import {
  apolloDecorator,
  chakraDecorator,
  storybookTitle,
} from "../../../../utils/storybook";

export default {
  title: storybookTitle(SigninModal),
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
