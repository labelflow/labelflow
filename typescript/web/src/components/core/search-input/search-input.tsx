import {
  forwardRef,
  Input,
  InputElementProps,
  InputGroup,
  InputGroupProps,
  InputLeftElement,
  InputProps,
  InputRightElement,
  Kbd,
  useControllableState,
} from "@chakra-ui/react";
import { isEmpty } from "lodash/fp";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
} from "react";
import { SetRequired } from "type-fest";
import { Icon, IconButton } from "../icons";

export type SearchInputProps = Omit<InputGroupProps, "value" | "onChange"> & {
  value?: string;
  onChange?: (value: string) => void;
  inputProps?: Omit<InputProps, "value" | "onChange">;
};

export type SearchInputState = SetRequired<
  SearchInputProps,
  "value" | "onChange"
>;

const SearchInputContext = createContext({} as SearchInputState);

const useSearchInput = () => useContext(SearchInputContext);

const SearchInputProvider = ({
  children,
  value: propsValue,
  onChange: propsOnChange,
  ...props
}: PropsWithChildren<SearchInputProps>) => {
  const [value, onChange] = useControllableState({
    defaultValue: "",
    value: propsValue,
    onChange: propsOnChange,
  });
  return (
    <SearchInputContext.Provider value={{ ...props, value, onChange }}>
      {children}
    </SearchInputContext.Provider>
  );
};

const SearchInputLeft = forwardRef<InputElementProps, "input">(
  (props: InputElementProps, ref) => (
    <InputLeftElement ref={ref} {...props} pointerEvents="none">
      <Icon name="search" fontSize="xl" />
    </InputLeftElement>
  )
);

const SearchInputValue = forwardRef<InputProps, "input">(
  (props: InputProps, ref) => {
    const { value, onChange, inputProps } = useSearchInput();
    return (
      <Input
        ref={ref}
        {...props}
        {...inputProps}
        value={value}
        onChange={useCallback(
          (event) => onChange(event.target.value),
          [onChange]
        )}
        placeholder="Search..."
      />
    );
  }
);

const ClearSearchButton = () => {
  const { onChange } = useSearchInput();
  return (
    <IconButton
      icon="close"
      label="Clear search"
      fontSize="xl"
      onClick={useCallback(() => onChange(""), [onChange])}
      cursor="pointer"
      variant="unstyled"
      display="flex"
      alignItems="center"
    />
  );
};

const SearchInputRight = forwardRef<InputElementProps, "div">((props, ref) => {
  const { value } = useSearchInput();
  return (
    <InputRightElement ref={ref} {...props} justify="flex-end">
      {isEmpty(value) ? <Kbd>/</Kbd> : <ClearSearchButton />}
    </InputRightElement>
  );
});

// https://github.com/chakra-ui/chakra-ui/issues/2269#issuecomment-712935052
Object.assign(SearchInputLeft, { id: "InputLeftElement" });
Object.assign(SearchInputValue, { id: "Input" });
Object.assign(SearchInputRight, { id: "InputRightElement" });

export const SearchInputComponent = () => {
  const { value, onChange, ...props } = useSearchInput();
  return (
    <InputGroup {...props}>
      <SearchInputLeft />
      <SearchInputValue />
      <SearchInputRight />
    </InputGroup>
  );
};

export const SearchInput = (props: SearchInputProps) => (
  <SearchInputProvider {...props}>
    <SearchInputComponent />
  </SearchInputProvider>
);
