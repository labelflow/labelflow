import {
  Icon as ChakraIcon,
  IconProps as ChakraIconProps,
  MergeWithAs,
} from "@chakra-ui/react";
import { SVGAttributes } from "react";
import { IconType } from "react-icons";
import { AppIcon, APP_ICONS } from "./app-icons";

export type IconProps = MergeWithAs<
  ChakraIconProps,
  SVGAttributes<SVGElement>,
  { name: AppIcon },
  IconType
>;

export const Icon = ({ name: icon, ...props }: IconProps) => {
  return <ChakraIcon {...props} as={APP_ICONS[icon]} />;
};
