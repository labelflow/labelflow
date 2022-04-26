import {
  NumberInput,
  NumberInputField,
  NumberInputFieldProps,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { DIGITS_PER_REM } from "./page-input.constants";
import { PageInputProvider, usePageInput } from "./page-input.context";
import { usePagination } from "./pagination.context";

const InputField = (props: NumberInputFieldProps) => {
  const { digits } = usePageInput();
  return (
    <NumberInputField
      rounded={6}
      onClick={(event) => event.currentTarget.select()}
      textAlign="center"
      w={`${digits * DIGITS_PER_REM + 1.5}rem`}
      pr={2}
      pl={1.5}
      {...props}
    />
  );
};

const CurrentInput = () => {
  const { total } = usePagination();
  const { value, handleChange, handleKeyDown, handleBlur } = usePageInput();
  return (
    <NumberInput
      name="current-page"
      rounded={6}
      allowMouseWheel
      min={1}
      max={total}
      variant="filled"
      textAlign="center"
      size="sm"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
    >
      <InputField />
    </NumberInput>
  );
};

const Current = () => (
  <Tooltip label="Current page" placement="top" openDelay={300}>
    <span>
      <CurrentInput />
    </span>
  </Tooltip>
);

const Total = () => {
  const { total } = usePagination();
  const { digits } = usePageInput();
  return (
    <Text
      mr={3}
      ml={2}
      w={`${digits * DIGITS_PER_REM + 0.5}rem`}
      textAlign="left"
      cursor="default"
      fontSize="sm"
    >
      {total}
    </Text>
  );
};

export const PageInput = () => (
  <PageInputProvider>
    <Current />
    <Text textAlign="center" userSelect="none" pl={2}>
      /
    </Text>
    <Total />
  </PageInputProvider>
);
