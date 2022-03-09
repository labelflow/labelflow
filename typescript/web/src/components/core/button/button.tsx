import {
  Button as ChakraButton,
  ButtonProps as ChakraButtonProps,
  ComponentWithAs,
  PropsOf,
} from "@chakra-ui/react";
import { isEmpty } from "@labelflow/utils";
import NextLink from "next/link";
import { OptionalParent } from "../../../utils";

export type ButtonProps = PropsOf<ComponentWithAs<"a", ChakraButtonProps>>;

export const Button = ({ href = "", ...props }: ButtonProps) => {
  const hasHref = !isEmpty(href);
  const buttonLinkProps: ButtonProps | undefined = hasHref
    ? { href, as: "a" }
    : undefined;
  return (
    <OptionalParent
      enabled={hasHref}
      parent={NextLink}
      parentProps={{ href, passHref: true }}
    >
      <ChakraButton {...buttonLinkProps} {...props} />
    </OptionalParent>
  );
};
