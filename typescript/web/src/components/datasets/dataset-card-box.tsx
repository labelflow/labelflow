import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";

export const DatasetCardBox = ({ children }: { children: ReactNode }) => (
  <Box
    w="100%"
    maxWidth={["100%", "100%", "50%", "33%", "25%"]}
    boxSizing="border-box"
    p={4}
  >
    {children}
  </Box>
);
