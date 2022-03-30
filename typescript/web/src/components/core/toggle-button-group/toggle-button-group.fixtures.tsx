import { IconButtonProps } from "@chakra-ui/react";
import { isNil } from "lodash/fp";
import { useState } from "react";
import { RiPriceTag3Fill, RiPriceTag3Line } from "react-icons/ri";
import {
  ToggleButton,
  ToggleButtonGroup,
  ToggleButtonProps,
  ToggleIconButton,
} from ".";

export type TestOption =
  | "optionA"
  | "optionB"
  | "imageOptionC"
  | "imageOptionD";

type TestOptionDefinition = {
  description: string;
  icon?: IconButtonProps["icon"];
};

export const TEST_OPTIONS: Record<TestOption, TestOptionDefinition> = {
  optionA: { description: "Option A" },
  optionB: { description: "Option B" },
  imageOptionC: { description: "Option C", icon: <RiPriceTag3Line /> },
  imageOptionD: { description: "Option D", icon: <RiPriceTag3Fill /> },
};

export type TestComponentProps = {
  defaultValue: TestOption;
};

export const TestComponent = ({ defaultValue }: TestComponentProps) => {
  const [value, setValue] = useState(defaultValue);
  return (
    <ToggleButtonGroup value={value} onChange={setValue}>
      {Object.entries(TEST_OPTIONS).map(
        ([optionValue, { description, icon }]) => {
          const commonProps: Pick<
            ToggleButtonProps,
            "value" | "description"
          > & { key: string } = {
            key: optionValue,
            value: optionValue,
            description,
          };
          return isNil(icon) ? (
            <ToggleButton {...commonProps}>{description}</ToggleButton>
          ) : (
            <ToggleIconButton
              {...commonProps}
              aria-label={description}
              icon={icon}
            />
          );
        }
      )}
    </ToggleButtonGroup>
  );
};
