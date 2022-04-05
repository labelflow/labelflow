import {
  Button as ChakraButton,
  ButtonProps as ChakraButtonProps,
  ComponentWithAs,
  forwardRef,
  PropsOf,
} from "@chakra-ui/react";
import { isNilOrEmpty } from "@labelflow/utils";
import { isNil } from "lodash/fp";
import NextLink from "next/link";
import { OptionalParent } from "../../../utils";
import { AppIcon, Icon, IconProps } from "../icons";
import { Tooltip, TooltipProps } from "../tooltip";

export type ButtonProps = Omit<
  PropsOf<ComponentWithAs<"a", ChakraButtonProps>>,
  "leftIcon" | "rightIcon"
> & {
  leftIcon?: AppIcon | IconProps;
  rightIcon?: AppIcon | IconProps;
  tooltip?: string | TooltipProps;
};

const getButtonIconProps = <TKey extends "leftIcon" | "rightIcon">(
  propKey: TKey,
  icon: AppIcon | IconProps | undefined
): LinkButtonProps[TKey] => {
  if (isNil(icon)) return undefined;
  const iconProps = typeof icon === "string" ? { name: icon } : icon;
  return { [propKey]: <Icon {...iconProps} /> };
};

const getButtonProps = ({
  href,
  leftIcon,
  rightIcon,
  ...buttonProps
}: ButtonProps): LinkButtonProps | undefined => {
  const linkProps = isNilOrEmpty(href) ? undefined : { href, as: "a" };
  const leftIconProps = getButtonIconProps("leftIcon", leftIcon);
  const rightIconProps = getButtonIconProps("rightIcon", rightIcon);
  return { ...linkProps, ...leftIconProps, ...rightIconProps, ...buttonProps };
};

type LinkButtonProps = Omit<ButtonProps, "tooltip">;

const LinkButton = forwardRef<LinkButtonProps, "button">(
  (props: LinkButtonProps, ref) => {
    const { href } = props;
    const hasHref = !isNilOrEmpty(href);
    return (
      <OptionalParent
        enabled={hasHref}
        parent={NextLink}
        parentProps={{ href, passHref: hasHref ? true : undefined }}
      >
        <ChakraButton ref={ref} {...getButtonProps(props)} />
      </OptionalParent>
    );
  }
);

const getTooltipProps = (tooltip?: ButtonProps["tooltip"]) =>
  typeof tooltip === "string" ? { label: tooltip } : tooltip;

export const Button = forwardRef<ButtonProps, "button">(
  ({ tooltip, ...props }, ref) => (
    <OptionalParent
      enabled={!isNilOrEmpty(tooltip)}
      parent={({ children, ...tooltipProps }) => (
        <Tooltip {...tooltipProps}>{children ?? <></>}</Tooltip>
      )}
      parentProps={getTooltipProps(tooltip)}
    >
      <LinkButton ref={ref} {...props} />
    </OptionalParent>
  )
);
