import {
  chakra,
  Icon as ChakraIcon,
  IconProps as ChakraIconProps,
  MergeWithAs,
} from "@chakra-ui/react";
import { SVGAttributes } from "react";
import { AppIcon, APP_ICONS, IconType } from "./app-icons";

export type IconPropsBase = { name: AppIcon };

export type IconProps = MergeWithAs<
  ChakraIconProps,
  SVGAttributes<SVGElement>,
  IconPropsBase,
  IconType
>;

export const Icon = ({ name: icon, ...props }: IconProps) => {
  const IconSvg = chakra(APP_ICONS[icon]);
  return <ChakraIcon as={IconSvg} {...props} />;
};
