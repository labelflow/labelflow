import { IconButton, Tooltip, ButtonProps, chakra } from "@chakra-ui/react";
import { FaRegKeyboard } from "react-icons/fa";
import { useQueryParam } from "use-query-params";
import { BoolParam } from "../../../../utils/query-param-bool";
import { KeymapModal } from "./keymap-modal";

const KeymapIcon = chakra(FaRegKeyboard);

type Props = ButtonProps & {
  showModal?: boolean;
};

export const KeymapButton = ({ showModal = true, ...props }: Props) => {
  const [isOpen, setIsOpen] = useQueryParam("modal-keymap", BoolParam);

  return (
    <>
      {showModal && (
        <KeymapModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false, "replaceIn")}
        />
      )}
      <Tooltip label="Keyboard shortcuts">
        <IconButton
          aria-label="Add images"
          icon={<KeymapIcon fontSize="xl" />}
          onClick={() => setIsOpen(true, "replaceIn")}
          variant="ghost"
          {...props}
        />
      </Tooltip>
    </>
  );
};
