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

export const LinkGrid = (props: SimpleGridProps) => (
  <SimpleGrid columns={3} {...props} fontSize={14}>
    <Box minW="130px">
      <FooterHeading mb="4">Product</FooterHeading>
      <Stack>
        <NextLink href="/">
          <Link href="/">Product</Link>
        </NextLink>
        <NextLink href="/pricing">
          <Link href="/pricing">Pricing</Link>
        </NextLink>
      </Stack>
    </Box>
    <Box minW="130px">
      <FooterHeading mb="4">Learn</FooterHeading>
      <Stack>
        <NextLink href="/about">
          <Link href="/about">About</Link>
        </NextLink>
        <NextLink href="/posts">
          <Link href="/posts">Blog</Link>
        </NextLink>
        <NextLink href="https://labelflow.gitbook.io/labelflow/">
          <Link href="https://labelflow.gitbook.io/labelflow/">
            Documentation
          </Link>
        </NextLink>
      </Stack>
    </Box>
    <Box minW="150px">
      <FooterHeading mb="4">Legal</FooterHeading>
      <Stack>
        <NextLink href="/legal/privacy-policy">
          <Link href="/legal/privacy-policy">Privacy policy</Link>
        </NextLink>
        <NextLink href="/legal/cookie-policy">
          <Link href="/legal/cookie-policy">Cookie policy</Link>
        </NextLink>
        <NextLink href="/legal/terms-and-conditions">
          <Link href="/legal/terms-and-conditions">Terms &amp; Conditions</Link>
        </NextLink>
      </Stack>
    </Box>
  </SimpleGrid>
);
