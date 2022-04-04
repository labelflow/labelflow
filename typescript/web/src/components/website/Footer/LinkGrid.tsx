import { Box, SimpleGrid, SimpleGridProps, Stack } from "@chakra-ui/react";
import * as React from "react";
import { DOCUMENTATION_URL } from "../../../constants";
import { TextLink } from "../../core";
import { FooterHeading } from "./FooterHeading";

interface FooterLink {
  href: string;
  label: string;
}

const openLinks: FooterLink[] = [{ href: "/open", label: "Open" }];

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
          <TextLink key={link.label} href={link.href}>
            {link.label}
          </TextLink>
        ))}
      </Stack>
    </Box>
  );
};

export const LinkGrid = (props: SimpleGridProps) => (
  <SimpleGrid columns={{ base: 1, md: 3 }} fontSize={14} {...props}>
    <GridBox minW="130px" heading="Product" links={productLinks} />
    <GridBox minW="130px" heading="Open Startup" links={openLinks} />
    <GridBox minW="130px" heading="Resources" links={learnLinks} />
    <GridBox minW="150px" heading="Legal" links={legalLinks} />
  </SimpleGrid>
);
