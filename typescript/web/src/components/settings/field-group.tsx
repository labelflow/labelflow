import { Box, BoxProps, Text, useColorModeValue } from "@chakra-ui/react";
import { ReactNode } from "react";

export type FieldGroupProps = Omit<BoxProps, "title"> & {
  title?: ReactNode;
  description?: ReactNode;
};

export const FieldGroup = ({
  title,
  description,
  ...boxProps
}: FieldGroupProps) => {
  const color = useColorModeValue("gray.600", "gray.400");
  return (
    <Box>
      <Text fontWeight="semibold">{title}</Text>
      {description && (
        <Text color={color} fontSize="sm">
          {description}
        </Text>
      )}
      <Box pt="5" {...boxProps} />
    </Box>
  );
};
