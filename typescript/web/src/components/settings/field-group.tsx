import {
  Box,
  BoxProps,
  Text,
  useColorModeValue as mode,
} from "@chakra-ui/react";
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
  return (
    <Box>
      <Text fontWeight="semibold">{title}</Text>
      {description && (
        <Text color={mode("gray.600", "gray.400")} fontSize="sm">
          {description}
        </Text>
      )}
      <Box pt="5" {...boxProps} />
    </Box>
  );
};
