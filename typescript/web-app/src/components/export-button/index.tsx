import { Button, ButtonProps, chakra } from "@chakra-ui/react";
import { useQueryParam } from "use-query-params";
import { RiDownloadCloud2Line } from "react-icons/ri";

import { ExportModal } from "./modal";
import { BoolParam } from "../../utils/query-param-bool";

const DownloadIcon = chakra(RiDownloadCloud2Line);

type Props = ButtonProps;

export const ExportButton = ({ ...props }: Props) => {
  const [isOpen, setIsOpen] = useQueryParam("modal-export", BoolParam);

  return (
    <>
      <ExportModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false, "replaceIn")}
      />
      <Button
        aria-label="Export"
        leftIcon={<DownloadIcon fontSize="xl" />}
        onClick={() => setIsOpen(true, "replaceIn")}
        variant="ghost"
        {...props}
      >
        Export
      </Button>
    </>
  );
};
