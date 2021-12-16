import {
  Button,
  Td,
  Tr,
  Kbd,
  Flex,
  chakra,
  IconButton,
  Text,
  useColorModeValue as mode,
  Tooltip,
} from "@chakra-ui/react";
import { RiCheckboxBlankCircleFill } from "react-icons/ri";
import { VscGripper } from "react-icons/vsc";
import React from "react";
import { LabelClassWithShortcut } from "./types";

const CircleIcon = chakra(RiCheckboxBlankCircleFill);
const DragIcon = chakra(VscGripper);

type TableCellProps = {
  children: any;
  isDragOccurring: boolean;
  isSmall?: boolean;
};

type TableCellSnapshot = {
  width: number;
  height: number;
};

// eslint-disable-next-line react/prefer-stateless-function
class TableCell extends React.Component<TableCellProps> {
  ref = React.createRef<HTMLTableCellElement>();

  getSnapshotBeforeUpdate(prevProps: TableCellProps): TableCellSnapshot | null {
    const { isDragOccurring } = this.props;
    if (!this.ref.current) {
      return null;
    }

    const isDragStarting: boolean =
      isDragOccurring && !prevProps.isDragOccurring;

    if (!isDragStarting) {
      return null;
    }

    const { width, height } = this.ref.current.getBoundingClientRect();

    const snapshot: TableCellSnapshot = {
      width,
      height,
    };

    return snapshot;
  }

  componentDidUpdate(
    prevProps: TableCellProps,
    prevState: any,
    snapshot: TableCellSnapshot
  ) {
    const { ref } = this;
    const { isDragOccurring } = this.props;
    if (!ref.current) {
      return;
    }

    if (snapshot) {
      if (ref.current.style.width === snapshot.width.toString()) {
        return;
      }
      ref.current.style.width = `${snapshot.width}px`;
      ref.current.style.height = `${snapshot.height}px`;
      return;
    }

    if (isDragOccurring) {
      return;
    }

    // inline styles not applied
    if (ref.current.style.width == null) {
      return;
    }

    // no snapshot and drag is finished - clear the inline styles
    ref.current.style.removeProperty("height");
    ref.current.style.removeProperty("width");
  }

  render() {
    const { children, isSmall } = this.props;
    return (
      <Td
        maxWidth="md"
        p={isSmall ? 0 : undefined}
        w={isSmall ? 0 : undefined}
        ref={this.ref}
      >
        {children}
      </Td>
    );
  }
}

export const IsDraggingContext = React.createContext<boolean>(false);

type TableRowProps = {
  provided: any;
  snapshot: any;
  item: LabelClassWithShortcut;
  onClickDelete: (classId: string | null) => void;
  onClickEdit: (item: LabelClassWithShortcut | null) => void;
};
export const TableRow = ({
  provided,
  item,
  onClickDelete,
  onClickEdit,
}: TableRowProps) => {
  const { name: className, shortcut, color, id } = item;
  const occurences = item.labelsAggregates.totalCount;
  const backgroundColor = mode("white", "gray.900");
  return (
    <IsDraggingContext.Consumer>
      {(isDragging: boolean) => (
        <Tr
          id={id}
          ref={provided.innerRef}
          bg={backgroundColor}
          {...provided.draggableProps}
        >
          <TableCell isDragOccurring={isDragging} isSmall>
            <div {...provided.dragHandleProps}>
              <IconButton
                variant="ghost"
                aria-label="Drag"
                alignItems="center"
                justifyContent="center"
                ml="1"
                icon={<DragIcon />}
                h="8"
                w="8"
                minWidth="8"
              />
            </div>
          </TableCell>
          <TableCell isDragOccurring={isDragging}>
            <Flex alignItems="center">
              <CircleIcon
                flexShrink={0}
                flexGrow={0}
                color={color}
                fontSize="4xl"
                ml="2"
                mr="2"
              />
              <Tooltip placement="top" label={className}>
                <Text isTruncated>{className}</Text>
              </Tooltip>
            </Flex>
          </TableCell>
          <TableCell isDragOccurring={isDragging}>{occurences}</TableCell>
          <TableCell isDragOccurring={isDragging}>
            {shortcut && (
              <Kbd flexShrink={0} flexGrow={0} justifyContent="center" mr="1">
                {shortcut}
              </Kbd>
            )}
          </TableCell>
          <TableCell isDragOccurring={isDragging}>
            <Flex justifyContent="flex-end">
              <span>
                <Button
                  variant="link"
                  colorScheme="blue"
                  onClick={() => onClickEdit(item)}
                  aria-label="Edit class"
                >
                  Edit
                </Button>
              </span>
              <span>
                <Button
                  variant="link"
                  colorScheme="blue"
                  onClick={() => onClickDelete(id)}
                  aria-label="Delete class"
                >
                  Remove
                </Button>
              </span>
            </Flex>
          </TableCell>
        </Tr>
      )}
    </IsDraggingContext.Consumer>
  );
};
