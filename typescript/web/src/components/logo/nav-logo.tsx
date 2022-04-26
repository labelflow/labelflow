import { Box, BreadcrumbLink, VisuallyHidden } from "@chakra-ui/react";
import { isEmpty, isNil } from "lodash/fp";
import NextLink from "next/link";
import { useOptionalWorkspace } from "../../hooks";
import { Logo } from "./logo";

export type NavLogoProps = {
  href?: string;
};

const useNavLogoHref = (href: string | undefined): string => {
  const workspace = useOptionalWorkspace();
  if (!isNil(href) && !isEmpty(href)) return href;
  return isNil(workspace) ? "/" : "/workspaces";
};

export const NavLogo = ({ href }: NavLogoProps) => (
  <NextLink href={useNavLogoHref(href)}>
    <BreadcrumbLink flexShrink={0} flexGrow={0}>
      <Box rel="home" cursor="pointer" mr="0" overflow="visible">
        <VisuallyHidden>LabelFlow</VisuallyHidden>
        <Logo h="8" logoOnly />
      </Box>
    </BreadcrumbLink>
  </NextLink>
);
