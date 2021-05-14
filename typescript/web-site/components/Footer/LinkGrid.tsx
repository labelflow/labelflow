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
  <SimpleGrid columns={1} {...props}>
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
    {/* <Box minW="130px">
      <FooterHeading mb="4">Legal</FooterHeading>
      <Stack>
        <NextLink href="/">
          <Link>Terms</Link>
        </NextLink>
        <NextLink href="/">
          <Link>License</Link>
        </NextLink>
      </Stack>
    </Box> */}
  </SimpleGrid>
);
