import { Box, chakra, IconButton } from "@chakra-ui/react";
import { VscGripper } from "react-icons/vsc";
import { ReorderableTableCell } from "./reorderable-table-cell";
import { useReorderableTableRow } from "./reorderable-table-row.context";

const HandleIcon = chakra(VscGripper);

export const ReorderableTableHandleCell = () => {
  const { dragHandleProps } = useReorderableTableRow();
  return (
    <ReorderableTableCell p={0} w={0}>
      <Box {...dragHandleProps} role="button" data-testid="handle" ml="1" p={0}>
        <IconButton
          aria-label="move row handle"
          cursor="grab"
          icon={<HandleIcon />}
          variant="ghost"
          minWidth="8"
          h="8"
          w="8"
          alignItems="center"
          justifyContent="center"
          // Removes the blue border around the button
          _focus={{ boxShadow: "none" }}
        />
      </Box>
    </ReorderableTableCell>
  );
};
