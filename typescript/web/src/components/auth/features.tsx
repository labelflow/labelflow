import React from "react";
import {
  Box,
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  chakra,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaCheck } from "react-icons/fa";

import { Logo } from "../logo";

const ChakraCheck = chakra(FaCheck);

const Feature = (props: { title: string; children: React.ReactNode }) => {
  const { title, children } = props;
  return (
    <Stack>
      <Text fontWeight="bold" display="inline-block">
        <ChakraCheck display="inline" color="brand.500" mr="2" />
        {title}
      </Text>
      <Text>{children}</Text>
    </Stack>
  );
};

export const Features = () => (
  <Flex
    direction="column"
    display={{ base: "none", lg: "flex" }}
    alignItems="start"
  >
    <Logo
      h="9"
      mb={{ base: "16", lg: "10" }}
      iconColor="brand.600"
      mx={{ base: "auto", lg: "unset" }}
    />
    <Box mb="8" textAlign={{ base: "center", lg: "start" }}>
      <Heading size="md" mb="2" fontWeight="extrabold">
        Join thousands of people building the future of AI
      </Heading>
    </Box>
    <SimpleGrid
      rounded="lg"
      p={{ base: "10", lg: "0" }}
      columns={1}
      spacing="6"
      bg={{ base: useColorModeValue("gray.200", "gray.700"), lg: "unset" }}
    >
      <Feature title="Collaborate Easily">
        Invite your teammates to work together on datasets and share your
        results.
      </Feature>
      <Feature title="Secure your Data">
        Your data is stored securely on our servers, no worry about your data
        integrity.
      </Feature>
      <Feature title="Label Faster">
        Use smart tools based on AI to label your data faster and more
        precisely.
      </Feature>
    </SimpleGrid>
  </Flex>
);
