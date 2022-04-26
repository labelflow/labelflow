import {
  Box,
  Button,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import * as React from "react";
import { HiShieldCheck } from "react-icons/hi";

export const RequestAccess = () => {
  const router = useRouter();
  return (
    <Box
      as="section"
      bg={useColorModeValue("gray.100", "gray.700")}
      py="48"
      minH="calc( 100vh - 430px)"
    >
      <Box
        textAlign="center"
        bg={useColorModeValue("white", "gray.800")}
        shadow="lg"
        maxW={{ base: "xl", md: "3xl" }}
        mx="auto"
        px={{ base: "6", md: "8" }}
        py="12"
        rounded="lg"
      >
        <Box maxW="md" mx="auto">
          <Heading mt="4" fontWeight="extrabold">
            Get early access and up to 50% off on LabelFlow by joining now
          </Heading>
          <Box mt="6">
            <form
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
              <Stack>
                <Input
                  aria-label="Enter your email"
                  placeholder="Enter your email"
                  rounded="base"
                  bg={useColorModeValue("white", "inherit")}
                  type="email"
                  name="email"
                  id="requestAccessEmail"
                  required
                  focusBorderColor={useColorModeValue("brand.500", "brand.300")}
                  _placeholder={{
                    opacity: 1,
                    color: useColorModeValue("gray.500", "whiteAlpha.700"),
                  }}
                />
                <Button
                  type="submit"
                  w="full"
                  colorScheme="brand"
                  size="lg"
                  fontWeight="bold"
                >
                  Join now
                </Button>
              </Stack>
            </form>
            <Text
              color={useColorModeValue("gray.600", "gray.400")}
              fontSize="sm"
              mt="5"
            >
              <Box
                aria-hidden
                as={HiShieldCheck}
                display="inline-block"
                marginEnd="2"
                fontSize="lg"
                color={useColorModeValue("brand.600", "brand.400")}
              />
              No spams. Your email is only used to register you in the queue
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
