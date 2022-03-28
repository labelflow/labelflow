import {
  Flex,
  forwardRef,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spacer,
  useColorModeValue,
  useMergeRefs,
} from "@chakra-ui/react";
import { isNil } from "lodash/fp";
import { ForwardedRef, ReactNode, useRef } from "react";
import { Button, ButtonProps } from "../button";
import { SearchInput } from "../search-input";
import { Tooltip } from "../tooltip";
import {
  ComboBoxItem,
  ComboBoxProvider,
  ComboBoxProviderProps,
  ObjectKey,
  useComboBox,
} from "./combo-box.context";

const Search = () => {
  const { getInputProps, setInputValue } = useComboBox();
  const ref = useRef<HTMLInputElement | null>(null);
  const {
    value,
    onChange,
    ref: inputRef,
    ...inputProps
  } = getInputProps({ ref });
  return (
    <SearchInput
      ref={inputRef}
      value={value}
      onChange={setInputValue}
      placeholder="Search..."
      inputProps={{
        ...inputProps,
        borderX: 0,
        borderTop: 0,
        borderBottomRadius: 0,
      }}
    />
  );
};

type ValueItemBodyProps<
  TValue extends ComboBoxItem<ObjectKey> = Record<ObjectKey, string>,
  TCompareKey extends keyof TValue = ObjectKey
> = { value: ComboBoxItem<TCompareKey> };

const ValueItemBody = <
  TValue extends ComboBoxItem<ObjectKey> = Record<ObjectKey, string>,
  TCompareKey extends keyof TValue = ObjectKey
>({
  value,
}: ValueItemBodyProps<TValue, TCompareKey>) => {
  const { item, listItem: ListItem = item } = useComboBox();
  return <ListItem key={value.id} {...value} />;
};

type ValueItemProps<
  TValue extends ComboBoxItem<ObjectKey> = Record<ObjectKey, string>,
  TCompareKey extends keyof TValue = ObjectKey
> = ValueItemBodyProps<TValue, TCompareKey> & { index: number };

const useItemBackground = <
  TValue extends ComboBoxItem<ObjectKey> = Record<ObjectKey, string>,
  TCompareKey extends keyof TValue = ObjectKey
>({
  value: { id: valueId },
  index,
}: ValueItemProps<TValue, TCompareKey>): string | undefined => {
  const { highlightedIndex, selectedItem } = useComboBox();
  const selectedBg = useColorModeValue("gray.300", "gray.500");
  const currentBg = useColorModeValue("gray.100", "gray.600");
  const selected = valueId === selectedItem?.id;
  if (selected) return selectedBg;
  return index === highlightedIndex ? currentBg : undefined;
};

const ValueItem = <
  TValue extends ComboBoxItem<ObjectKey> = Record<ObjectKey, string>,
  TCompareKey extends keyof TValue = ObjectKey
>({
  value,
  index,
}: ValueItemProps<TValue, TCompareKey>) => {
  const { getItemProps, items } = useComboBox();
  return (
    <Flex
      direction="row"
      justify="stretch"
      cursor="pointer"
      m={0}
      borderWidth={0}
      borderStyle="none"
      borderBottomRadius={index === items.length - 1 ? "md" : undefined}
      p=".5em"
      bg={useItemBackground({ value, index })}
      {...getItemProps({ item: value, index })}
    >
      <ValueItemBody value={value} />
    </Flex>
  );
};

const ValuesList = <
  TValue extends ComboBoxItem<ObjectKey> = Record<ObjectKey, string>,
  TCompareKey extends keyof TValue = ObjectKey
>() => {
  const { items, getMenuProps } = useComboBox<TValue, TCompareKey>();
  return (
    <Flex
      {...getMenuProps()}
      flexGrow={1}
      direction="column"
      overflowY="auto"
      maxH="340"
    >
      {items.map((item, index) => (
        <ValueItem key={item.id} value={item} index={index} />
      ))}
    </Flex>
  );
};

const SearchableList = () => {
  const { getComboboxProps } = useComboBox();
  return (
    <Flex
      {...getComboboxProps()}
      flexGrow={1}
      direction="column"
      align="stretch"
    >
      <Search />
      <ValuesList />
    </Flex>
  );
};

const ListPopoverContent = () => (
  <PopoverContent cursor="default" pointerEvents="initial">
    <PopoverBody p={0} borderStyle="none" borderWidth={0}>
      <SearchableList />
    </PopoverBody>
  </PopoverContent>
);

type ListPopoverProps = { trigger: ReactNode };

const ListPopover = ({ trigger }: ListPopoverProps) => {
  const { isOpen, closeMenu, openMenu } = useComboBox();
  return (
    <Popover
      isOpen={isOpen}
      onClose={closeMenu}
      onOpen={openMenu}
      placement="bottom-start"
      preventOverflow
    >
      <PopoverTrigger>{trigger}</PopoverTrigger>
      <ListPopoverContent />
    </Popover>
  );
};

const useMainButtonProps = (
  props: ButtonProps,
  chakraRef: ForwardedRef<HTMLButtonElement>
): ButtonProps => {
  const { getToggleButtonProps } = useComboBox();
  const { ref: downshiftRef, ...downshiftProps } = getToggleButtonProps();
  return {
    ref: useMergeRefs(chakraRef, downshiftRef),
    "aria-label": "Select value",
    rightIcon: "selector",
    minW: 100,
    variant: "outline",
    ...downshiftProps,
    ...props,
    tabIndex: 0,
  };
};

const MainButtonItem = () => {
  const { item: Item, selectedItem } = useComboBox();
  return isNil(selectedItem) ? <Spacer /> : <Item {...selectedItem} />;
};

const MainButton = forwardRef<ButtonProps, "button">((props, chakraRef) => (
  <Tooltip label="Click to select a value" placement="bottom" openDelay={500}>
    <Button {...useMainButtonProps(props, chakraRef)}>
      <MainButtonItem />
    </Button>
  </Tooltip>
));

export type ComboBoxProps<
  TValue extends ComboBoxItem<ObjectKey> = Record<ObjectKey, string>,
  TCompareKey extends keyof TValue = ObjectKey
> = ComboBoxProviderProps<TValue, TCompareKey> &
  Partial<
    Pick<ButtonProps, "bg" | "borderWidth" | "borderStyle" | "disabled">
  > & {
    "data-testid"?: string;
  };

export const ComboBox = <
  TValue extends ComboBoxItem<ObjectKey> = Record<ObjectKey, string>,
  TCompareKey extends keyof TValue = ObjectKey
>({
  bg,
  borderStyle,
  borderWidth,
  disabled,
  "data-testid": testId,
  ...props
}: ComboBoxProps<TValue, TCompareKey>) => (
  <ComboBoxProvider {...props}>
    <ListPopover
      trigger={
        <MainButton
          data-testid={testId}
          bg={bg}
          borderStyle={borderStyle}
          borderWidth={borderWidth}
          disabled={disabled}
        />
      }
    />
  </ComboBoxProvider>
);
