import {
  Button,
  ButtonProps,
  Flex,
  forwardRef,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spacer,
  Tooltip,
  useColorModeValue,
  useMergeRefs,
} from "@chakra-ui/react";
import { isNil } from "lodash/fp";
import { ForwardedRef, ReactNode } from "react";
import { Icon } from "../icons";
import { SearchInput } from "../search-input";
import {
  ComboBoxItem,
  ComboBoxProvider,
  ComboBoxProviderProps,
  ObjectKey,
  useComboBox,
} from "./combo-box.context";

const NewSearchInput = () => {
  const { getInputProps, setInputValue } = useComboBox();
  const { onChange, ...inputProps } = getInputProps();
  return (
    <SearchInput
      {...inputProps}
      onChange={setInputValue}
      placeholder="Search..."
      inputProps={{ borderX: 0, borderTop: 0, borderBottomRadius: 0 }}
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
  const { item, listItem: Listitem = item } = useComboBox();
  return <Listitem key={value.id} {...value} />;
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
  const highlighted = index === highlightedIndex;
  return highlighted ? currentBg : undefined;
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
    <Flex {...getMenuProps()} flexGrow={1} direction="column" overflowY="auto">
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
      <NewSearchInput />
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
      trigger="click"
      placement="bottom-start"
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
    rightIcon: <Icon name="selector" fontSize="md" />,
    minW: 100,
    variant: "outline",
    ...downshiftProps,
    ...props,
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
  Pick<ButtonProps, "bg" | "borderWidth" | "borderStyle" | "disabled">;

export const ComboBox = <
  TValue extends ComboBoxItem<ObjectKey> = Record<ObjectKey, string>,
  TCompareKey extends keyof TValue = ObjectKey
>({
  bg,
  borderStyle,
  borderWidth,
  disabled,
  ...props
}: ComboBoxProps<TValue, TCompareKey>) => (
  <ComboBoxProvider {...props}>
    <ListPopover
      trigger={
        <MainButton
          bg={bg}
          borderStyle={borderStyle}
          borderWidth={borderWidth}
          disabled={disabled}
        />
      }
    />
  </ComboBoxProvider>
);
