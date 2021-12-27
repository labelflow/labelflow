import { Text, TextProps } from "@chakra-ui/react";
import { isEmpty } from "lodash/fp";

export interface OptionalTextProps extends Omit<TextProps, "children"> {
  text?: string;
  error?: string;
  hideEmpty?: boolean;
}

export const OptionalText = ({
  text,
  error,
  hideEmpty,
  ...props
}: OptionalTextProps) => {
  const content = (error || text) ?? "";
  return (
    <Text
      visibility={isEmpty(content) && hideEmpty ? "hidden" : undefined}
      color={isEmpty(error) ? undefined : "red.500"}
      {...props}
    >
      {isEmpty(content) && !hideEmpty ? <br /> : content}
    </Text>
  );
};
