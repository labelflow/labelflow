import {
  HStack,
  Avatar,
  Box,
  Button,
  FormControl,
  FormLabel,
  Select,
  Switch,
  Text,
  Stack,
  StackDivider,
  StackProps,
} from "@chakra-ui/react";
import * as React from "react";
import { Card } from "./card";
import { FieldGroup } from "./field-group";
import { HeadingGroup } from "./heading-group";

export const AccountSettings = (props: StackProps) => (
  <Stack as="section" spacing="6" {...props}>
    <HeadingGroup
      title="Account Settings"
      description="Change your profile, request your data, and more"
    />
    <Card>
      <Stack divider={<StackDivider />} spacing="6">
        <FieldGroup
          title="Name &amp; Avatar"
          description="Change your name and profile picture"
        >
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
          <HStack mt="5">
            <Button size="sm" fontWeight="normal">
              Change name
            </Button>
            <Button size="sm" fontWeight="normal">
              Change gravatar
            </Button>
          </HStack>
        </FieldGroup>

        <FieldGroup
          title="Login details"
          description="Change your email and password"
        >
          <Text fontSize="sm">lisat09@example.com</Text>
          <HStack mt="5">
            <Button size="sm" fontWeight="normal">
              Change email
            </Button>
            <Button size="sm" fontWeight="normal">
              Change password
            </Button>
          </HStack>
        </FieldGroup>

        <FieldGroup
          title="Language"
          description="Change your preferred language and currency"
        >
          <Stack
            direction={{ base: "column", md: "row" }}
            width="full"
            spacing="4"
          >
            <FormControl id="language">
              <FormLabel fontSize="sm">Language</FormLabel>
              <Select size="sm" maxW="2xs">
                <option>English</option>
                <option>Hebrew</option>
                <option>Arabic</option>
              </Select>
            </FormControl>

            <FormControl id="currency">
              <FormLabel fontSize="sm">Currency</FormLabel>
              <Select size="sm" maxW="2xs">
                <option>USD ($)</option>
                <option>AED (dh)</option>
                <option>EUR (€)</option>
              </Select>
            </FormControl>
          </Stack>
          <Button mt="5" size="sm" fontWeight="normal">
            Save Changes
          </Button>
        </FieldGroup>

        <FieldGroup
          title="Communications"
          description="Manage your email preference"
        >
          <Stack spacing="3">
            <FormControl display="flex" alignItems="center">
              <FormLabel
                htmlFor="email-marketing"
                flex="1"
                fontSize="sm"
                mb="0"
              >
                Product intro, tips, and inspiration
              </FormLabel>
              <Switch id="email-marketing" />
            </FormControl>
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="email-news" flex="1" fontSize="sm" mb="0">
                Updates about company news and features
              </FormLabel>
              <Switch id="email-news" />
            </FormControl>
          </Stack>
          <Button mt="5" size="sm" fontWeight="normal">
            Save Changes
          </Button>
        </FieldGroup>
      </Stack>
    </Card>
  </Stack>
);
