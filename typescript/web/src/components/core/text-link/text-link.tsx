import { Link, LinkProps } from "@chakra-ui/react";
import NextLink from "next/link";
import { SetRequired } from "type-fest";

export type TextLinkProps = SetRequired<LinkProps, "href">;

export const TextLink = ({ children, href, ...props }: TextLinkProps) => (
  <NextLink href={href} passHref>
    <Link href={href} {...props}>
      {children}
    </Link>
  </NextLink>
);
