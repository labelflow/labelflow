import {
  Button,
  chakra,
  HTMLChakraProps,
  Input,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import * as React from "react";
import { useRouter } from "next/router";

import { FooterHeading } from "./FooterHeading";

export const SubscribeForm = (props: HTMLChakraProps<"form">) => {
  const router = useRouter();

  return (
    <chakra.form
      {...props}
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);

        formData.append("date", new Date().toISOString());
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
          // listen for state changes
          if (xhr.readyState === 4 && xhr.status === 200) {
            router.push(`/thank-you?email=${formData.get("email")}`);
          }
        };
        xhr.open(
          "POST",
          "https://hooks.zapier.com/hooks/catch/3107949/byy0oig/",
          true
        );
        xhr.send(formData);
      }}
      action="https://hooks.zapier.com/hooks/catch/3107949/byy0oig/"
      method="post"
      encType="multipart/form-data"
    >
      <Stack spacing="4">
        <FooterHeading textAlign={{ base: "center", md: "start" }}>
          Newsletter
        </FooterHeading>
        <Text textAlign={{ base: "center", md: "start" }}>
          Get news about our product and releases
        </Text>
        <Stack spacing="4" direction={{ base: "column", md: "row" }}>
          <Input
            bg={useColorModeValue("white", "inherit")}
            placeholder="Enter your email"
            type="email"
            name="email"
            id="footerEmail"
            required
            focusBorderColor={useColorModeValue("brand.500", "brand.300")}
            _placeholder={{
              opacity: 1,
              color: useColorModeValue("gray.500", "whiteAlpha.700"),
            }}
          />
          <Button
            type="submit"
            colorScheme="brand"
            flexShrink={0}
            width={{ base: "full", md: "auto" }}
          >
            Subscribe
          </Button>
        </Stack>
      </Stack>
    </chakra.form>
  );
};
