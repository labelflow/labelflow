import { Box, Stack, StackDivider, VisuallyHidden } from "@chakra-ui/react";
import * as React from "react";
import NextLink from "next/link";
import { Copyright } from "./Copyright";
import { LinkGrid } from "./LinkGrid";
import { SocialMediaLinks } from "./SocialMediaLinks";
import { SubscribeForm } from "./SubscribeForm";
import { Logo } from "../../logo";

export const Footer = () => (
  <Box
    as="footer"
    role="contentinfo"
    mx="auto"
    maxW="7xl"
    py="12"
    px={{ base: "4", md: "8" }}
  >
    <Stack spacing="10" divider={<StackDivider />}>
      <Stack
        direction={{ base: "column", lg: "row" }}
        spacing={{ base: "10", lg: "28" }}
      >
        <NextLink href="/website">
          <Box as="a" href="/website" mx={{ base: "auto", lg: "0" }}>
            <VisuallyHidden>LabelFlow</VisuallyHidden>
            <Logo h="6" cursor="pointer" />
          </Box>
        </NextLink>

        <Stack
          direction={{ base: "column", xl: "row" }}
          spacing={{ base: "10", xl: "20" }}
        >
          <LinkGrid spacing={{ base: "10", md: "20" }} flex="1" />
          <SubscribeForm />
        </Stack>
      </Stack>
      <Stack
        direction={{ base: "column-reverse", md: "row" }}
        justifyContent="space-between"
        alignItems="center"
      >
        <Copyright />
        <SocialMediaLinks />
      </Stack>
    </Stack>
  </Box>
);
