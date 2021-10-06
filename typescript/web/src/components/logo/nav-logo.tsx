import { Box, VisuallyHidden, BreadcrumbLink } from "@chakra-ui/react";

import NextLink from "next/link";

import { Logo } from "./logo";

export const NavLogo = () => {
  return (
    <NextLink href="/">
      <BreadcrumbLink>
        <Box as="a" rel="home" cursor="pointer" mr={{ base: "0", lg: "0" }}>
          <VisuallyHidden>LabelFlow</VisuallyHidden>
          <Logo h="6" iconColor="brand.500" logoOnly />
        </Box>
      </BreadcrumbLink>
    </NextLink>
  );
};
