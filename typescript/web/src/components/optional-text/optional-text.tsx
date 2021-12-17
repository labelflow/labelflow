import { Text, TextProps } from "@chakra-ui/react";
import { isEmpty } from "lodash/fp";

export interface OptionalTextProps extends Omit<TextProps, "children"> {
  text?: string;
  error?: string;
}

export const OptionalText = ({ text, error, ...props }: OptionalTextProps) => {
  const content = (error || text) ?? "";
  return (
    <Text
      visibility={isEmpty(content) ? "hidden" : undefined}
      color={isEmpty(error) ? undefined : "red.500"}
      {...props}
    >
      {content}
    </Text>
  );
};
