import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Box,
  Flex,
  Text,
  useColorModeValue,
  Heading,
  chakra,
} from "@chakra-ui/react";

import { useSelect } from "downshift";
import { RiArrowDownSFill, RiArrowUpSFill } from "react-icons/ri";
import { BiCheck } from "react-icons/bi";
import { MembershipRole } from "../../graphql-types/globalTypes";

const CheckIcon = chakra(BiCheck);

const roleDescriptions = {
  [MembershipRole.Owner]: "Manages datasets, users and billing",
  [MembershipRole.Admin]: "Manages datasets and users",
  [MembershipRole.Member]: "Cannot delete datasets or images",
};

export type RoleListItemProps = {
  name: string;
  description: string;
  selected: boolean;
  itemProps: any;
  highlight: boolean;
};

type UseRoleBgColorOptions = Pick<
  RoleListItemProps,
  "selected" | "highlight" | "name"
>;

const useRoleBgColors = ({
  selected,
  highlight,
  name,
}: UseRoleBgColorOptions): [string, string] => {
  if (selected) return ["gray.300", "gray.500"];
  return highlight && name === "Owner"
    ? ["gray.100", "gray.600"]
    : ["transparent", "transparent"];
};

const useRoleBgColor = (options: UseRoleBgColorOptions): string =>
  useColorModeValue(...useRoleBgColors(options));

const RoleListItem = ({
  name,
  description,
  selected,
  itemProps,
  highlight,
}: RoleListItemProps) => (
  <Box
    flexGrow={1}
    bgColor={useRoleBgColor({ selected, highlight, name })}
    key={name}
    pl="3"
    pr="3"
    pt="1"
    pb="1"
    aria-current={selected}
    {...itemProps}
    maxWidth="320"
    opacity={name !== "Owner" ? "0.5" : undefined}
    pointerEvents={name !== "Owner" ? "none" : undefined}
  >
    <Flex flexDirection="row" alignItems="center">
      <CheckIcon
        visibility={selected ? "visible" : "hidden"}
        pb="1"
        fontSize="3xl"
        minWidth="6"
      />
      <Heading as="h5" size="sm">
        {`${name}${name !== "Owner" ? " (Coming Soon)" : ""}`}
      </Heading>
    </Flex>
    <Flex flexDirection="row" alignItems="center">
      <CheckIcon visibility="hidden" pb="1" fontSize="3xl" minWidth="6" />
      <Text
        pointerEvents="none"
        flexGrow={1}
        whiteSpace="normal"
        overflow="hidden"
        textOverflow="ellipsis"
      >
        {description}
      </Text>
    </Flex>
  </Box>
);

export const RoleSelection = ({
  isDisabled,
  role: currentRole,
  changeMembershipRole,
}: {
  isDisabled?: boolean;
  role: MembershipRole;
  changeMembershipRole: (role: MembershipRole) => void;
}) => {
  const roleItems = Object.keys(MembershipRole) as Array<MembershipRole>;
  const {
    isOpen,
    getToggleButtonProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
    reset,
  } = useSelect<MembershipRole>({
    items: roleItems,
    onSelectedItemChange: (changes) => {
      const newRole = changes.selectedItem;
      if (newRole != null) {
        changeMembershipRole(newRole);
      }
    },
    initialSelectedItem: currentRole,
  });
  return (
    <Popover
      isOpen={isOpen}
      onClose={() => {
        reset();
      }}
      matchWidth
    >
      <PopoverTrigger>
        <Button
          {...getToggleButtonProps()}
          isDisabled={isDisabled}
          variant="outline"
          textAlign="start"
          justifyContent="space-between"
          alignContent="flex-start"
          rightIcon={isOpen ? <RiArrowUpSFill /> : <RiArrowDownSFill />}
        >
          {currentRole}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverBody pl="0" pr="0" pb="0" pt="0">
          <Box {...getMenuProps()} pb="2" pt="2">
            {roleItems.map((role, index) => (
              <RoleListItem
                name={MembershipRole[role]}
                description={roleDescriptions[MembershipRole[role]]}
                selected={currentRole === role}
                key={role}
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
