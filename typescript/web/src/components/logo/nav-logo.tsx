import { Box, VisuallyHidden, BreadcrumbLink } from "@chakra-ui/react";

import NextLink from "next/link";

import { Logo } from "./logo";

export const NavLogo = () => {
  return (
    <NextLink href="/">
      <BreadcrumbLink flexShrink={0} flexGrow={0}>
        <Box rel="home" cursor="pointer" mr="0" overflow="visible">
          <VisuallyHidden>LabelFlow</VisuallyHidden>
          <Logo h="8" iconColor="brand.500" logoOnly />
        </Box>
      </BreadcrumbLink>
    </NextLink>
  );
};
