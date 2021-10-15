import {
  HStack,
  Avatar,
  Box,
  Button,
  Text,
  Stack,
  StackDivider,
  useColorModeValue,
} from "@chakra-ui/react";
import * as React from "react";
import { FieldGroup } from "./field-group";
import { HeadingGroup } from "./heading-group";

export const Profile = ({
  user,
}: {
  user: { name?: string; createdAt: string; url?: string };
}) => (
  <Box
    bg={useColorModeValue("gray.50", "gray.800")}
    px={{ base: "4", md: "10" }}
    py="16"
  >
    <Stack as="section" spacing="6">
      <HeadingGroup
        title="Account Settings"
        description="Change your profile"
      />
      <Box
        bg={useColorModeValue("white", "gray.700")}
        shadow="base"
        rounded="lg"
        p={{ base: "4", md: "8" }}
        m={{ base: "4", md: "8" }}
      >
        <Stack divider={<StackDivider />} spacing="6">
          <FieldGroup title="Name &amp; Avatar" description="Change your name">
            <HStack spacing="4">
              <Avatar
                src="https://images.unsplash.com/photo-1470506028280-a011fb34b6f7?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1349&q=80"
                name="Lisa Turner"
              />
              <Box>
                <Text>Lisa Turner</Text>
                <Text color="gray.500" fontSize="sm">
                  Joined March, 2010
                </Text>
              </Box>
            </HStack>
          </FieldGroup>
          <Box flexDirection="row" alignSelf="flex-end">
            <Button m="1" size="sm" fontWeight="normal" alignSelf="flex-end">
              Cancel
            </Button>
            <Button
              m="1"
              mr="0"
              size="sm"
              alignSelf="flex-end"
              bg="brand.500"
              color="#FFFFFF"
            >
              Save Changes
            </Button>
          </Box>
        </Stack>
      </Box>
    </Stack>
  </Box>
);
