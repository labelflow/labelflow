import { IconButton, Tooltip, ButtonProps, chakra } from "@chakra-ui/react";
import { FaRegKeyboard } from "react-icons/fa";
import { useQueryParam } from "use-query-params";
import { BoolParam } from "../../../../utils/query-param-bool";

const KeymapIcon = chakra(FaRegKeyboard);

type Props = ButtonProps;

export const KeymapButton = ({ ...props }: Props) => {
  const [, setIsOpen] = useQueryParam("modal-keymap", BoolParam);

  return (
    <Tooltip label="Keyboard shortcuts" openDelay={300}>
      <IconButton
        display={{ base: "none", lg: "flex" }}
        aria-label="Keyboard shortcuts"
        icon={<KeymapIcon fontSize="xl" />}
        onClick={() => setIsOpen(true, "replaceIn")}
        variant="ghost"
        {...props}
      />
    </Tooltip>
  );
};
