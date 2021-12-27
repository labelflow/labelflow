import { TableCellProps, Td } from "@chakra-ui/react";
import { isNil } from "lodash/fp";
import { Component, createRef } from "react";
import { useReorderableTable } from "./reorderable-table.context";

type ReorderableTableCellProps = TableCellProps & {
  isDragging: boolean;
};

type ReorderableTableCellSnapshot = {
  width: number;
  height: number;
};

// eslint-disable-next-line react/prefer-stateless-function
class ReorderableTableCellComponent extends Component<ReorderableTableCellProps> {
  ref = createRef<HTMLTableCellElement>();

  getSnapshotBeforeUpdate(
    prevProps: ReorderableTableCellProps
  ): ReorderableTableCellSnapshot | null {
    const { isDragging: isDragOccurring } = this.props;
    if (isNil(this.ref.current)) return null;
    const isDragStarting = isDragOccurring && !prevProps.isDragging;
    if (!isDragStarting) return null;
    return this.ref.current.getBoundingClientRect();
  }

  componentDidUpdate(
    _prevProps: ReorderableTableCellProps,
    _prevState: any,
    snapshot: ReorderableTableCellSnapshot
  ) {
    const { isDragging: isDragOccurring } = this.props;
    const refStyle = this.ref.current?.style;
    if (isNil(refStyle)) return;
    if (snapshot) {
      if (refStyle.width !== snapshot.width.toString()) {
        refStyle.width = `${snapshot.width}px`;
        refStyle.height = `${snapshot.height}px`;
      }
    } else if (!isDragOccurring) {
      // no snapshot and drag is finished - clear the inline styles
      if (!isNil(refStyle.width)) {
        refStyle.removeProperty("width");
      }
      if (!isNil(refStyle.height)) {
        refStyle.removeProperty("height");
      }
    }
  }

  render() {
    const { isDragging, ...props } = this.props;
    return <Td maxWidth="md" ref={this.ref} {...props} />;
  }
}

export const ReorderableTableCell = (props: TableCellProps) => {
  const isDragging = useReorderableTable();
  return <ReorderableTableCellComponent isDragging={isDragging} {...props} />;
};
