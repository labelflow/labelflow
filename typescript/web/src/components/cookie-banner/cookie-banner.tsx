import { Button, HStack, Stack, Text } from "@chakra-ui/react";
import React, { useCallback } from "react";
import { useCookies } from "react-cookie";
import { isInWindowScope } from "../../utils/detect-scope";
import { trackEvent } from "../../utils/google-analytics";
import { TextLink } from "../core";

export const CookieBanner = () => {
  const [{ consentedCookies }, setConsentedCookies] = useCookies([
    "consentedCookies",
  ]);

  const handleAccept = useCallback(() => {
    window?.clarity?.("consent");
    setConsentedCookies("consentedCookies", "true", {
      path: "/",
      httpOnly: false,
    });
    trackEvent("accept_cookies", {});
  }, [setConsentedCookies]);

  const handleReject = useCallback(() => {
    setConsentedCookies("consentedCookies", "false", {
      path: "/",
      httpOnly: false,
    });
    trackEvent("reject_cookies", {});
  }, [setConsentedCookies]);

  return (
    <HStack
      display={
        consentedCookies === "true" ||
        consentedCookies === "false" ||
        !isInWindowScope
          ? "none"
          : "flex"
      }
      justify="center"
      spacing="4"
      p="4"
      bg="brand.600"
      bgGradient="linear(to-r, brand.700, brand.600)"
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      zIndex="100"
    >
      <Text color="white" fontSize={{ base: "sm", md: "md" }}>
        Like every organization on earth we use cookies. We use cookies to
        analyze our product usage. We don&apos;t use cookies for commercial
        purposes.{" "}
        <TextLink href="/legal/cookie-policy" textDecoration="underline">
          Learn More
        </TextLink>
      </Text>
      <Stack direction={{ base: "column", md: "row" }} spacing={4}>
        <Button
          color="white"
          colorScheme="whiteAlpha"
          size="sm"
          flexShrink={0}
          onClick={handleReject}
          variant="outline"
        >
          Reject
        </Button>
        <Button
          bg="white"
          color="brand.800"
          _hover={{ bg: "gray.100" }}
          size="sm"
          flexShrink={0}
          onClick={handleAccept}
        >
          Accept
        </Button>
      </Stack>
    </HStack>
  );
};
