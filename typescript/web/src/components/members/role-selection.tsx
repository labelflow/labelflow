import { useState } from "react";
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  Box,
  Text,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { useSelect } from "downshift";

import { MembershipRole } from "@labelflow/graphql-types";

import { RiArrowDownSFill, RiArrowUpSFill } from "react-icons/ri";

const roleDescriptions = {
  [MembershipRole.Admin]: "manages datasets and users (coming soon)",
  [MembershipRole.Member]: "cannot delete datasets or images (coming soon)",
};

const RoleListItem = ({
  name,
  description,
  selected,
  itemProps,
  highlight,
}) => {
  const bgColor = (() => {
    if (selected) {
      return mode("gray.300", "gray.500");
    }
    if (highlight) {
      return mode("gray.100", "gray.600");
    }
    return "transparent";
  })();
  return (
    <Box
      flexGrow={1}
      bgColor={bgColor}
      key={`${name}`}
      pl="3"
      pr="3"
      pt="1"
      pb="1"
      aria-current={selected}
      {...itemProps}
    >
      <Text
        pointerEvents="none"
        flexGrow={1}
        whiteSpace="nowrap"
        overflow="hidden"
      >
        {`${name} - ${description}`}
      </Text>
    </Box>
  );
};

export const RoleSelection = ({
  role: currentRole,
  changeMembershipRole,
}: {
  role: string;
  changeMembershipRole: () => {};
}) => {
  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({
    items: Object.keys(MembershipRole).map((key) => MembershipRole[key]),
    onSelectedItemChange: changeMembershipRole,
    initialSelectedItem: currentRole,
  });
  return (
    <Popover isOpen={isOpen}>
      <PopoverTrigger>
        <Button
          {...getToggleButtonProps()}
          variant="ghost"
          rightIcon={isOpen ? <RiArrowUpSFill /> : <RiArrowDownSFill />}
        >
          {currentRole}
        </Button>
      </PopoverTrigger>
      <PopoverContent flex={1} w="max-content">
        <PopoverBody>
          <Box {...getMenuProps()}>
            {Object.keys(MembershipRole).map((role, index) => (
              <RoleListItem
                name={MembershipRole[role]}
                description={roleDescriptions[MembershipRole[role]]}
                selected={currentRole === role}
                key={`${role}${index}`}
                itemProps={getItemProps({ item: role, index })}
                highlight={highlightedIndex === index}
              />
            ))}
          </Box>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
