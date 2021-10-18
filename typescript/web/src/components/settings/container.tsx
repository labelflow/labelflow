import { ReactNode } from "react";
import { Box, Stack } from "@chakra-ui/react";

export const SettingsContainer = ({ children }: { children: ReactNode }) => {
  return (
    <Box px={{ base: "4", md: "10" }} py="16">
      <Box maxW="xl" mx="auto">
        <Stack spacing="12">{children}</Stack>
      </Box>
    </Box>
  );
};
