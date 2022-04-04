import { ButtonGroup, ButtonGroupProps, useRadioGroup } from "@chakra-ui/react";
import React from "react";
import { ToggleIconButtonProps } from "./toggle-icon-button";
import { ToggleButtonProps } from "./toggle-button";

export type ToggleButtonGroupProps<TValue> = Omit<
  ButtonGroupProps,
  "onChange"
> & {
  name?: string;
  value: TValue;
  defaultValue?: string;
  onChange?: (value: TValue) => void;
};

export const ToggleButtonGroup = <TValue extends string>(
  props: ToggleButtonGroupProps<TValue>
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
        .filter<React.ReactElement<ToggleIconButtonProps | ToggleButtonProps>>(
          React.isValidElement
        )
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
  return (
    <ButtonGroup isAttached variant="outline" {...getRootProps(rest)}>
      {buttons}
    </ButtonGroup>
  );
};
