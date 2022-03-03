import {
  Box,
  Button,
  ButtonProps,
  useColorModeValue,
  useId,
  useRadio,
  UseRadioProps,
  Tooltip,
} from "@chakra-ui/react";

export type ToggleButtonProps = ButtonProps & {
  value: string;
  description: string;
  radioProps?: UseRadioProps;
};

export const ToggleButton = ({
  radioProps,
  description,
  ...rest
}: ToggleButtonProps) => {
  const { getInputProps, getCheckboxProps, getLabelProps } =
    useRadio(radioProps);
  const id = useId(undefined, "toggle-button");

  const inputProps = getInputProps();
  const checkboxProps = getCheckboxProps();
  const labelProps = getLabelProps();

  const { value } = rest;

  return (
    <Tooltip label={description} placement="bottom" openDelay={300}>
      <Box as="label" cursor="pointer" {...labelProps}>
        <input
          {...inputProps}
          aria-labelledby={id}
          data-testid={`toggle button input ${value}`}
        />
        <Button
          id={id}
          as="div"
          data-testid={`toggle button ${value}`}
          color={useColorModeValue("gray.600", "whiteAlpha.700")}
          _checked={{
            color: useColorModeValue("inherit", "whiteAlpha.900"),
            bg: useColorModeValue("gray.300", "whiteAlpha.300"),
          }}
          {...checkboxProps}
          {...rest}
        />
      </Box>
    </Tooltip>
  );
};
