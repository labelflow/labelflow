import { ButtonGroup, ButtonGroupProps, useRadioGroup } from "@chakra-ui/react";
import * as React from "react";
import { ToggleButtonProps } from "./toggle-button";

interface ToggleButtonGroupProps<T> extends Omit<ButtonGroupProps, "onChange"> {
  name?: string;
  value: T;
  defaultValue?: string;
  onChange?: (value: T) => void;
}

export const ToggleButtonGroup = <T extends string>(
  props: ToggleButtonGroupProps<T>
) => {
  const { children, name, defaultValue, value, onChange, isDisabled, ...rest } =
    props;
  const { getRootProps, getRadioProps } = useRadioGroup({
    name,
    defaultValue,
    value,
    onChange,
  });

  const buttons = React.useMemo(
    () =>
      React.Children.toArray(children)
        .filter<React.ReactElement<ToggleButtonProps>>(React.isValidElement)
        .map((button, index, array) => {
          const isFirstItem = index === 0;
          const isLastItem = array.length === index + 1;

          const styleProps = {
            ...(isFirstItem && !isLastItem ? { borderRightRadius: 0 } : {}),
            ...(!isFirstItem && isLastItem ? { borderLeftRadius: 0 } : {}),
            ...(!isFirstItem && !isLastItem ? { borderRadius: 0 } : {}),
            ...(!isLastItem ? { mr: "-px" } : {}),
          };

          return React.cloneElement(button, {
            ...styleProps,
            radioProps: getRadioProps({
              value: button.props.value,
              disabled: isDisabled || button.props.isDisabled,
            }),
          });
        }),
    [children, getRadioProps, isDisabled]
  );
  return <ButtonGroup {...getRootProps(rest)}>{buttons}</ButtonGroup>;
};
