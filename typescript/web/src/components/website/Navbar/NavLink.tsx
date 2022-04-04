import { chakra, HTMLChakraProps, useColorModeValue } from "@chakra-ui/react";
import * as React from "react";
import NextLink from "next/link";

interface NavLinkProps extends HTMLChakraProps<"a"> {
  active?: boolean;
  href?: string;
}

const DesktopNavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(
  (props: NavLinkProps, ref) => {
    const { active, href, target, ...rest } = props;
    return (
      <NextLink href={href ?? "#"}>
        <chakra.a
          ref={ref}
          display="inline-block"
          px="4"
          py="6"
          cursor="pointer"
          fontWeight="semibold"
          aria-current={active ? "page" : undefined}
          color={useColorModeValue("gray.600", "gray.400")}
          transition="all 0.2s"
          target={target}
          {...rest}
          _hover={{ color: "gray.500" }}
          _active={{ color: "brand.600" }}
          _activeLink={{
            color: "brand.600",
            fontWeight: "bold",
          }}
          href={href}
        />
      </NextLink>
    );
  }
);
DesktopNavLink.displayName = "DesktopNavLink";

export const MobileNavLink = (props: NavLinkProps) => {
  const { active, href, target, ...rest } = props;
  return (
    <NextLink href={href ?? "#"}>
      <chakra.a
        cursor="pointer"
        aria-current={active ? "page" : undefined}
        w="full"
        display="flex"
        alignItems="center"
        height="14"
        fontWeight="semibold"
        borderBottomWidth="1px"
        href={href}
        target={target}
        {...rest}
      />
    </NextLink>
  );
};

export const NavLink = {
  Mobile: MobileNavLink,
  Desktop: DesktopNavLink,
};
