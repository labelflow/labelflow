import { Button, ButtonProps, useDisclosure, chakra } from "@chakra-ui/react";

import { RiDownload2Line } from "react-icons/ri";
import { ExportModal } from "./modal";

const DownloadIcon = chakra(RiDownload2Line);

type Props = ButtonProps;

export const ExportButton = ({ ...props }: Props) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <ExportModal isOpen={isOpen} onClose={onClose} />
      <Button
        aria-label="Export"
        leftIcon={<DownloadIcon fontSize="xl" />}
        onClick={onOpen}
        variant="ghost"
        {...props}
      >
        Export
      </Button>
    </>
  );
};
