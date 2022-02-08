import {
  Box,
  Link,
  SimpleGrid,
  SimpleGridProps,
  Stack,
} from "@chakra-ui/react";
import * as React from "react";
import NextLink from "next/link";
import { FooterHeading } from "./FooterHeading";
import { DOCUMENTATION_URL } from "../../../constants";

interface FooterLink {
  href: string;
  label: string;
}

const productLinks: FooterLink[] = [
  { href: "/", label: "Product" },
  { href: "/pricing", label: "Pricing" },
];

const learnLinks: FooterLink[] = [
  { href: "/about", label: "About" },
  { href: "/posts", label: "Blog" },
  { href: DOCUMENTATION_URL, label: "Documentation" },
  { href: "https://labelflow.recruitee.com/", label: "Jobs" },
];

const legalLinks: FooterLink[] = [
  { href: "/legal/privacy-policy", label: "Privacy policy" },
  { href: "/legal/cookie-policy", label: "Cookie policy" },
  { href: "/legal/terms-and-conditions", label: "Terms & Conditions" },
];

interface GridBoxProps {
  minW: string;
  heading: string;
  links: FooterLink[];
}
const GridBox = ({ minW, heading, links }: GridBoxProps) => {
  return (
    <Box minW={minW}>
      <FooterHeading mb="4" textAlign={{ base: "center", md: "start" }}>
        {heading}
      </FooterHeading>
      <Stack align={{ base: "center", md: "start" }}>
        {links.map((link) => (
          <NextLink key={link.label} href={link.href}>
            <Link href="/">{link.label}</Link>
          </NextLink>
        ))}
      </Stack>
    </Box>
  );
};

export const LinkGrid = (props: SimpleGridProps) => (
  <SimpleGrid columns={{ base: 1, md: 3 }} fontSize={14} {...props}>
    <GridBox minW="130px" heading="Product" links={productLinks} />
    <GridBox minW="130px" heading="Learn" links={learnLinks} />
    <GridBox minW="150px" heading="Legal" links={legalLinks} />
  </SimpleGrid>
);
