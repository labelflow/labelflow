import { useState } from "react";
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
} from "@chakra-ui/react";

import { RiArrowDownSFill, RiArrowUpSFill } from "react-icons/ri";

export const RoleSelection = ({ role }: { role: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Popover onOpen={() => setIsOpen(true)} onClose={() => setIsOpen(false)}>
      <PopoverTrigger>
        <Button
          variant="ghost"
          rightIcon={isOpen ? <RiArrowUpSFill /> : <RiArrowDownSFill />}
        >
          {role}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverBody>Owner</PopoverBody>
        <PopoverBody>Admin</PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
