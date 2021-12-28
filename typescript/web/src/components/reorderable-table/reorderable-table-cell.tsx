import { TableCellProps, Td } from "@chakra-ui/react";
import { isNil } from "lodash/fp";
import { Component, createRef } from "react";
import { useReorderableTable } from "./reorderable-table.context";

type ReorderableTableCellProps = TableCellProps & {
  isDragging: boolean;
};

type ReorderableTableCellState = {
  prevWidth?: number;
};

type Snapshot = {
  width: string | undefined;
  minWidth: string | undefined;
  height: string | undefined;
  minHeight: string | undefined;
};

// eslint-disable-next-line react/prefer-stateless-function
class ReorderableTableCellComponent extends Component<
  ReorderableTableCellProps,
  ReorderableTableCellState
> {
  ref = createRef<HTMLTableCellElement>();

  constructor(props: ReorderableTableCellProps) {
    super(props);
    this.state = {};
  }

  getSnapshotBeforeUpdate(
    prevProps: ReorderableTableCellProps
  ): Snapshot | null {
    const { isDragging } = this.props;
    if (isNil(this.ref.current)) return null;
    const isDragStarting = isDragging && !prevProps.isDragging;
    const isDragEnding = !isDragging && prevProps.isDragging;
    if (isDragStarting) {
      const rect = this.ref.current.getBoundingClientRect();
      const width = `${rect.width}px`;
      const height = `${rect.height}px`;
      return { width, minWidth: width, height, minHeight: height };
    }
    return isDragEnding
      ? {
          width: undefined,
          minWidth: undefined,
          height: undefined,
          minHeight: undefined,
        }
      : null;
  }

  componentDidUpdate(
    _prevProps: ReorderableTableCellProps,
    _prevState: never,
    snapshot?: Snapshot
  ) {
    Object.entries(snapshot ?? {}).forEach(([name, value]) => {
      this.setStyleProperty(name as keyof Snapshot, value);
    });
  }

  setStyleProperty(name: keyof Snapshot, value: string | undefined) {
    if (isNil(this.ref.current)) return;
    const { style } = this.ref.current;
    if (isNil(value)) {
      style[name] = "";
    } else {
      style[name] = value;
    }
  }

  render() {
    const { isDragging, ...props } = this.props;
    return <Td ref={this.ref} {...props} />;
  }
}

export const ReorderableTableCell = (props: TableCellProps) => {
  const isDragging = useReorderableTable();
  return <ReorderableTableCellComponent isDragging={isDragging} {...props} />;
};
