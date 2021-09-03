import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { RiMailSendLine } from "react-icons/ri";
import * as React from "react";

export const SigupForm = () => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // your submit logic here
      }}
    >
      <Stack spacing="4">
        <FormControl id="email">
          {/* <FormLabel mb={1}>Email</FormLabel> */}
          <Input
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
          />
        </FormControl>
        <Button
          variant="outline"
          leftIcon={<Box as={RiMailSendLine} color="yellow.500" />}
        >
          Sign in with Email
        </Button>
        {/* <FormControl>
          <Flex align="baseline" justify="space-between">
            <FormLabel mb={1}>Password</FormLabel>
            <Box
              as="a"
              href="#"
              fontWeight="semibold"
              fontSize="sm"
              color={mode("brand.600", "brand.200")}
            >
              Forgot Password?
            </Box>
          </Flex>
          <Input type="password" autoComplete="current-password" />
        </FormControl> */}
        {/* <Button type="submit" colorScheme="brand" size="lg" fontSize="md">
          Create my account
        </Button> */}
      </Stack>
    </form>
  );
};
