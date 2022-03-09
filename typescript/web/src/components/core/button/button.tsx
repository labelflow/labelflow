import {
  Button as ChakraButton,
  ButtonProps as ChakraButtonProps,
  ComponentWithAs,
  PropsOf,
} from "@chakra-ui/react";
import { isEmpty } from "@labelflow/utils";
import { isNil } from "lodash/fp";
import NextLink from "next/link";
import { OptionalParent } from "../../../utils";
import { AppIcon, Icon, IconProps } from "../icons";

type LinkButtonProps = PropsOf<ComponentWithAs<"a", ChakraButtonProps>>;

export type ButtonProps = Omit<LinkButtonProps, "leftIcon" | "rightIcon"> & {
  leftIcon?: AppIcon | IconProps;
  rightIcon?: AppIcon | IconProps;
};

const getIconProps = (
  icon: AppIcon | IconProps | undefined
): IconProps | undefined => {
  if (isEmpty(icon)) return undefined;
  return typeof icon === "string" ? { name: icon } : icon;
};

const getButtonIconProps = <TKey extends "leftIcon" | "rightIcon">(
  propKey: TKey,
  icon: AppIcon | IconProps | undefined
): LinkButtonProps[TKey] => {
  const iconProps = getIconProps(icon);
  if (isNil(iconProps)) return undefined;
  const iconComponent = <Icon {...iconProps} />;
  return { [propKey]: iconComponent };
};

const getButtonProps = ({
  href,
  leftIcon,
  rightIcon,
  ...buttonProps
}: ButtonProps): LinkButtonProps | undefined => {
  const linkProps = isEmpty(href) ? undefined : { href, as: "a" };
  const leftIconProps = getButtonIconProps("leftIcon", leftIcon);
  const rightIconProps = getButtonIconProps("rightIcon", rightIcon);
  return { ...linkProps, ...leftIconProps, ...rightIconProps, ...buttonProps };
};

export const Button = (props: ButtonProps) => {
  const { href } = props;
  const buttonProps = getButtonProps(props);
  return (
    <OptionalParent
      enabled={!isEmpty(href)}
      parent={NextLink}
      parentProps={{ href, passHref: true }}
    >
      <ChakraButton {...buttonProps} />
    </OptionalParent>
  );
};
