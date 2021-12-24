import {
  Button,
  ButtonProps,
  chakra,
  Flex,
  HStack,
  IconButton,
  Kbd,
  Td,
  Text,
  Tooltip,
  Tr,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { Component, createContext, createRef, useContext } from "react";
import {
  DraggableProvided,
  DraggableProvidedDragHandleProps,
} from "react-beautiful-dnd";
import { RiCheckboxBlankCircleFill } from "react-icons/ri";
import { VscGripper } from "react-icons/vsc";
import { LabelClassWithShortcut } from "./types";

const CircleIcon = chakra(RiCheckboxBlankCircleFill);
const DragIcon = chakra(VscGripper);

type TableCellProps = {
  children: any;
  isDragging: boolean;
  isSmall?: boolean;
};

type TableCellSnapshot = {
  width: number;
  height: number;
};

// eslint-disable-next-line react/prefer-stateless-function
class TableCell extends Component<TableCellProps> {
  ref = createRef<HTMLTableCellElement>();

  getSnapshotBeforeUpdate(prevProps: TableCellProps): TableCellSnapshot | null {
    const { isDragging: isDragOccurring } = this.props;
    if (!this.ref.current) {
      return null;
    }

    const isDragStarting: boolean = isDragOccurring && !prevProps.isDragging;

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
    const { isDragging: isDragOccurring } = this.props;
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

export const IsDraggingContext = createContext(false);

const DragHandleButton = () => (
  <IconButton
    aria-label="Drag"
    icon={<DragIcon />}
    variant="ghost"
    ml="1"
    minWidth="8"
    h="8"
    w="8"
    alignItems="center"
    justifyContent="center"
    cursor="move"
    // Removes the blue border around the button
    _focus={{ boxShadow: "none" }}
  />
);

const DragHandleCell = (props: Partial<DraggableProvidedDragHandleProps>) => {
  const isDragging = useContext(IsDraggingContext);
  return (
    <TableCell isDragging={isDragging} isSmall>
      <div {...props}>
        <DragHandleButton />
      </div>
    </TableCell>
  );
};

const NameAndColorCell = ({ name, color }: { name: string; color: string }) => {
  const isDragging = useContext(IsDraggingContext);
  return (
    <TableCell isDragging={isDragging}>
      <Flex alignItems="center">
        <CircleIcon
          flexShrink={0}
          flexGrow={0}
          color={color}
          fontSize="4xl"
          ml="2"
          mr="2"
        />
        <Tooltip placement="top" label={name}>
          <Text isTruncated>{name}</Text>
        </Tooltip>
      </Flex>
    </TableCell>
  );
};

const OccurrencesCell = ({ occurences }: { occurences: number }) => {
  const isDragging = useContext(IsDraggingContext);
  return <TableCell isDragging={isDragging}>{occurences}</TableCell>;
};

const ShortcutCell = ({ shortcut }: { shortcut: string | undefined }) => {
  const isDragging = useContext(IsDraggingContext);
  return (
    <TableCell isDragging={isDragging}>
      {shortcut && (
        <Kbd flexShrink={0} flexGrow={0} justifyContent="center" mr="1">
          {shortcut}
        </Kbd>
      )}
    </TableCell>
  );
};

const EditButton = (props: ButtonProps) => (
  <Button variant="link" colorScheme="blue" aria-label="Edit class" {...props}>
    Edit
  </Button>
);

const DeleteButton = (props: ButtonProps) => (
  <Button
    variant="link"
    colorScheme="blue"
    aria-label="Delete class"
    {...props}
  >
    Delete
  </Button>
);

const ActionsCell = ({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const isDragging = useContext(IsDraggingContext);
  return (
    <TableCell isDragging={isDragging}>
      <HStack justify="flex-end">
        <EditButton onClick={onEdit} />
        <DeleteButton onClick={onDelete} />
      </HStack>
    </TableCell>
  );
};

export interface TableRowProps {
  provided: DraggableProvided;
  item: LabelClassWithShortcut;
  onDelete: (classId: string | null) => void;
  onEdit: (item: LabelClassWithShortcut | null) => void;
}

export const TableRow = ({
  provided,
  item,
  onDelete,
  onEdit,
}: TableRowProps) => {
  const { name: className, shortcut, color, id } = item;
  const backgroundColor = mode("white", "gray.900");
  return (
    <Tr
      id={id}
      ref={provided.innerRef}
      bg={backgroundColor}
      {...provided.draggableProps}
    >
      <DragHandleCell {...provided.dragHandleProps} />
      <NameAndColorCell name={className} color={color} />
      <OccurrencesCell occurences={item.labelsAggregates.totalCount} />
      <ShortcutCell shortcut={shortcut} />
      <ActionsCell onEdit={() => onEdit(item)} onDelete={() => onDelete(id)} />
    </Tr>
  );
};
