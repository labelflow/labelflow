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
  useMergeRefs,
} from "@chakra-ui/react";
import { isEmpty, isNil } from "lodash/fp";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useRef,
} from "react";
import { SetRequired } from "type-fest";
import { useSearchHotkeys } from "../../../hooks";
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
        {...props}
        {...inputProps}
        data-testid="search-input-value"
        ref={ref}
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
      data-testid="search-input-clear-button"
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

export const SearchInputComponent = forwardRef<{}, "input">((_, inputRef) => {
  const { value, onChange, inputProps, ...props } = useSearchInput();
  const ref = useRef<HTMLDivElement | null>(null);
  const mergedRef = useMergeRefs(ref, inputRef);
  useSearchHotkeys(() => ref.current?.focus(), {
    enabled: !isNil(ref),
  });
  return (
    <InputGroup {...props} ref={ref}>
      <SearchInputLeft />
      <SearchInputValue ref={mergedRef} />
      <SearchInputRight />
    </InputGroup>
  );
});

export const SearchInput = forwardRef<SearchInputProps, "input">(
  (props, ref) => (
    <SearchInputProvider {...props}>
      <SearchInputComponent ref={ref} />
    </SearchInputProvider>
  )
);
