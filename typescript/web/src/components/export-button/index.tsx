import {
  Button,
  ButtonProps,
  Tooltip,
  IconButton,
  chakra,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useQueryParam } from "use-query-params";
import { RiDownloadCloud2Line } from "react-icons/ri";
import { trackEvent } from "../../utils/google-analytics";
import { BoolParam } from "../../utils/query-param-bool";
import { ExportModal } from "./export-modal";

const DownloadIcon = chakra(RiDownloadCloud2Line);

type Props = ButtonProps;

export { ExportButton } from "./export-button";
