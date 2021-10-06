import { useState } from "react";
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  Box,
  Flex,
  Text,
  useColorModeValue as mode,
  Heading,
  chakra,
} from "@chakra-ui/react";

import { useSelect } from "downshift";
import { MembershipRole } from "@labelflow/graphql-types";
import { RiArrowDownSFill, RiArrowUpSFill } from "react-icons/ri";
import { BiCheck } from "react-icons/bi";

const CheckIcon = chakra(BiCheck);

const roleDescriptions = {
  [MembershipRole.Admin]: "Manages datasets and users (coming soon)",
  [MembershipRole.Member]: "Cannot delete datasets or images (coming soon)",
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
      // pb="1"
      aria-current={selected}
      {...itemProps}
      maxWidth="320"
    >
      <Flex flexDirection="row" alignItems="center">
        <CheckIcon
          visibility={selected ? "visible" : "hidden"}
          pb="1"
          fontSize="2xl"
          minWidth="6"
        />
        <Heading as="h5" size="sm">
          {name}
        </Heading>
      </Flex>
      <Flex flexDirection="row" alignItems="center">
        <CheckIcon
          visibility="hidden"
          pb="1"
          fontSize="2xl"
          minWidth="6"
        />
        <Text
          mt="1"
          pointerEvents="none"
          flexGrow={1}
          whiteSpace="normal"
          overflow="hidden"
          //noOfLines={2}
          textOverflow="ellipsis"
        >
          {description}
        </Text>
      </Flex>
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
      <PopoverContent>
      <PopoverBody pl="0" pr="0" pb="0" pt="0">
          <Box {...getMenuProps()} pb="2" pt="2">
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
