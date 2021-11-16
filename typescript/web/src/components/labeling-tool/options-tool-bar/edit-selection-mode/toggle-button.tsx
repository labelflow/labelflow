import {
  Box,
  IconButton,
  IconButtonProps,
  useColorModeValue,
  useId,
  useRadio,
  UseRadioProps,
  Tooltip,
} from "@chakra-ui/react";
import * as React from "react";

export interface ToggleButtonProps extends IconButtonProps {
  value: string;
  description: string;
  radioProps?: UseRadioProps;
}

export const ToggleButton = (props: ToggleButtonProps) => {
  const { radioProps, description, ...rest } = props;
  const { getInputProps, getCheckboxProps, getLabelProps } =
    useRadio(radioProps);
  const id = useId(undefined, "toggle-button");

  const inputProps = getInputProps();
  const checkboxProps = getCheckboxProps();
  const labelProps = getLabelProps();

  return (
    <Tooltip label={description} placement="bottom" openDelay={300}>
      <Box as="label" cursor="pointer" {...labelProps}>
        <input {...inputProps} aria-labelledby={id} />
        <IconButton
          as="div"
          id={id}
          color={useColorModeValue("gray.600", "whiteAlpha.700")}
          _checked={{
            color: useColorModeValue("inherit", "whiteAlpha.900"),
            bg: useColorModeValue("gray.200", "whiteAlpha.300"),
          }}
          {...checkboxProps}
          {...rest}
        />
      </Box>
    </Tooltip>
  );
};
