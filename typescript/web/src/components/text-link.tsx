import { Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { PropsWithChildren } from "react";

export type TextLinkProps = PropsWithChildren<{
  href: string;
}>;

export const TextLink = ({ children, href }: TextLinkProps) => (
  <NextLink href={href}>
    <Text as="u" cursor="pointer">
      {children}
    </Text>
  </NextLink>
);
