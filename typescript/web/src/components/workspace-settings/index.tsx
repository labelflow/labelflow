import { Box, Stack, useColorModeValue } from "@chakra-ui/react";
import * as React from "react";
import { AccountSettings } from "./account-settings";
import { DangerZone } from "./danger-zone";
import { SocialAccountSettings } from "./social-account-settings";

export const WorkspaceSettings = () => (
  <Box px={{ base: "4", md: "10" }} py="16">
    <Box maxW="xl" mx="auto">
      <Stack spacing="12">
        <AccountSettings />
        <SocialAccountSettings />
        <DangerZone />
      </Stack>
    </Box>
  </Box>
);
