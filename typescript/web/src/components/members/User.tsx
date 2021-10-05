import { Box, Img, Stack } from "@chakra-ui/react";
import * as React from "react";

interface UserProps {
  data: {
    image: string;
    name: string;
    email: string;
  };
}

export const User = (props: UserProps) => {
  const { image, name, email } = props.data;
  return (
    <Stack direction="row" spacing="4" align="center">
      <Box flexShrink={0} h="10" w="10">
        <Img
          objectFit="cover"
          htmlWidth="160px"
          htmlHeight="160px"
          w="10"
          h="10"
          rounded="full"
          src={image}
          alt=""
        />
      </Box>
      <Box>
        <Box fontSize="sm" fontWeight="medium">
          {name}
        </Box>
        <Box fontSize="sm" color="gray.500">
          {email}
        </Box>
      </Box>
    </Stack>
  );
};
