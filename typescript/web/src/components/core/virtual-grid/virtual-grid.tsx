import {
  Box,
  Flex,
  FlexProps,
  SimpleGrid,
  StackProps,
  useBreakpointValue,
  useToken,
} from "@chakra-ui/react";
import { isNil, range } from "lodash/fp";
import React, {
  createContext,
  PropsWithChildren,
  RefObject,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from "react";
import {
  Options as ReactVirtualOptions,
  useVirtual,
  VirtualItem,
} from "react-virtual";
import { useDebounce } from "use-debounce";

export type UseVirtualResult = ReturnType<typeof useVirtual>;

export type VirtualGridItemProps<TItem> = {
  item: TItem;
  index: number;
};

export type RenderItemFn<TItem> = (
  props: VirtualGridItemProps<TItem>
) => JSX.Element;

export type VirtualGridProviderProps<TItem = unknown> = Pick<
  ReactVirtualOptions<HTMLDivElement>,
  "overscan"
> & {
  items: TItem[];
  minItemWidth: number;
  itemHeight: number;
  renderItem: RenderItemFn<TItem>;
};

export type VirtualGridProps<TItem> = VirtualGridProviderProps<TItem> &
  Omit<FlexProps, "children">;

type VirtualGridState = UseVirtualResult &
  VirtualGridProviderProps<unknown> & {
    containerRef: RefObject<HTMLDivElement>;
    spacing: StackProps["spacing"];
    spacingPx: number;
    rowCount: number;
    itemsPerRow: number;
  };

const VirtualGridContext = createContext({} as VirtualGridState);

const useVirtualGrid = () => useContext(VirtualGridContext);

const parseRem = (str: string): number => {
  const strValue = str.substring(0, str.length - 3);
  return parseFloat(strValue);
};

const getFontSize = (): number => {
  const { fontSize } = getComputedStyle(document.documentElement);
  return parseFloat(fontSize);
};

const remToPx = (rem: number | string): number => {
  const remValue = typeof rem === "number" ? rem : parseRem(rem);
  return remValue * getFontSize();
};

const useSpacing = (): Pick<VirtualGridState, "spacing" | "spacingPx"> => {
  const spacing = useBreakpointValue({ base: "2", md: "6" }) ?? "2";
  const [spacingRem] = useToken("space", [spacing]);
  const spacingPx = useMemo(() => remToPx(spacingRem), [spacingRem]);
  return { spacing, spacingPx };
};

type UseRowsOptions = Pick<
  VirtualGridState,
  "items" | "minItemWidth" | "containerRef" | "spacingPx"
>;

type UseRowsResult = Pick<VirtualGridState, "rowCount" | "itemsPerRow">;

const useRows = ({
  items,
  minItemWidth,
  containerRef,
  spacingPx,
}: UseRowsOptions): UseRowsResult => {
  const [clientWidth] = useDebounce(
    containerRef.current?.clientWidth ?? NaN,
    75,
    { leading: true, trailing: true }
  );
  return useMemo(() => {
    const gridWidth = clientWidth - spacingPx;
    const itemWidth = minItemWidth + spacingPx;
    const itemsPerRow = Math.max(Math.floor(gridWidth / itemWidth), 1);
    const rowCount = Math.ceil(items.length / itemsPerRow);
    return { rowCount, itemsPerRow };
  }, [clientWidth, items.length, minItemWidth, spacingPx]);
};

type UseVirtualStateOptions = Pick<
  VirtualGridState,
  "itemHeight" | "spacingPx" | "containerRef" | "rowCount" | "overscan"
>;

const useVirtualState = ({
  itemHeight,
  spacingPx,
  containerRef,
  rowCount,
  overscan,
}: UseVirtualStateOptions): UseVirtualResult => {
  const estimateSize = useCallback(
    () => itemHeight + spacingPx,
    [itemHeight, spacingPx]
  );
  return useVirtual({
    size: rowCount,
    parentRef: containerRef,
    estimateSize,
    paddingStart: spacingPx,
    paddingEnd: spacingPx,
    overscan,
  });
};

const useVirtualGridProvider = (
  props: VirtualGridProviderProps
): VirtualGridState => {
  const containerRef = useRef<HTMLDivElement>(null);
  const spacingState = useSpacing();
  const stateWithRefAndSpacing = { containerRef, ...props, ...spacingState };
  const rowsState = useRows(stateWithRefAndSpacing);
  const stateWithRows = { ...stateWithRefAndSpacing, ...rowsState };
  const virtualState = useVirtualState(stateWithRows);
  return { ...stateWithRows, ...virtualState };
};

const VirtualGridProvider = ({
  children,
  ...props
}: PropsWithChildren<VirtualGridProviderProps>) => (
  <VirtualGridContext.Provider value={useVirtualGridProvider(props)}>
    {children}
  </VirtualGridContext.Provider>
);

type ItemProps = { index: number };

const Item = ({ index }: ItemProps) => {
  const { items, renderItem: ItemComponent, itemHeight } = useVirtualGrid();
  const item = items[index];
  return (
    <>
      {!isNil(item) && (
        <Flex direction="row" align="stretch" h={`${itemHeight}px`}>
          <Flex grow={1} direction="column" align="stretch">
            <ItemComponent item={item} index={index} />
          </Flex>
        </Flex>
      )}
    </>
  );
};

const ItemRow = ({ index: rowIndex, start }: VirtualItem) => {
  const { itemsPerRow, spacing } = useVirtualGrid();
  const itemStart = rowIndex * itemsPerRow;
  return (
    <SimpleGrid
      key={rowIndex}
      columns={itemsPerRow}
      spacing={spacing}
      position="absolute"
      w="full"
      transform={`translateY(${start}px)`}
      px={spacing}
    >
      {range(itemStart, itemStart + itemsPerRow).map((imageIndex) => (
        <Item key={imageIndex} index={imageIndex} />
      ))}
    </SimpleGrid>
  );
};

const Content = () => {
  const { virtualItems, totalSize, spacingPx } = useVirtualGrid();
  return (
    <Box h={totalSize - spacingPx} position="relative">
      {virtualItems.map((item) => (
        <ItemRow {...item} />
      ))}
    </Box>
  );
};

const Container = (props: FlexProps) => {
  const { containerRef } = useVirtualGrid();
  return (
    <Flex minH="0" direction="column" {...props}>
      <Box
        data-testid="virtual-grid-scrollable-box"
        flexGrow={1}
        minH="0"
        overflowY="auto"
        ref={containerRef}
      >
        <Content />
      </Box>
    </Flex>
  );
};

const VirtualGridComponent = ({
  items,
  minItemWidth,
  itemHeight,
  renderItem,
  ...props
}: VirtualGridProps<unknown>): JSX.Element => (
  <VirtualGridProvider
    items={items}
    minItemWidth={minItemWidth}
    itemHeight={itemHeight}
    renderItem={renderItem}
  >
    <Container {...props} />
  </VirtualGridProvider>
);

export function VirtualGrid<TItem>(
  props: VirtualGridProps<TItem>
): JSX.Element {
  return <VirtualGridComponent {...(props as VirtualGridProps<unknown>)} />;
}
