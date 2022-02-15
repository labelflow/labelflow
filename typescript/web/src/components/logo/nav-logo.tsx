import { Box, VisuallyHidden, BreadcrumbLink } from "@chakra-ui/react";
import { isNil } from "lodash/fp";

import NextLink from "next/link";
import { useOptionalWorkspace } from "../../hooks";

import { Logo } from "./logo";

export const NavLogo = () => {
  const workspace = useOptionalWorkspace();
  const href = isNil(workspace) ? "/" : "/workspaces";
  return (
    <NextLink href={href}>
      <BreadcrumbLink flexShrink={0} flexGrow={0}>
        <Box rel="home" cursor="pointer" mr="0" overflow="visible">
          <VisuallyHidden>LabelFlow</VisuallyHidden>
          <Logo h="8" iconColor="brand.500" logoOnly />
        </Box>
      </BreadcrumbLink>
    </NextLink>
  );
};
