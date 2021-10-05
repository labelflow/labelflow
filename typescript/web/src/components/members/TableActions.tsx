import {
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Stack,
  chakra,
} from "@chakra-ui/react";
import * as React from "react";
import { IoSearch } from "react-icons/io5";
import { RiAddFill, RiArrowRightUpLine } from "react-icons/ri";

const SearchIcon = chakra(IoSearch);

export const TableActions = () => {
  return (
    <Stack
      spacing="4"
      direction={{ base: "column", md: "row" }}
      justify="space-between"
    >
      <HStack>
        <FormControl minW={{ md: "320px" }} id="search">
          <InputGroup size="sm">
            <FormLabel srOnly>Find a member</FormLabel>
            <InputLeftElement pointerEvents="none" color="gray.400">
              <SearchIcon />
            </InputLeftElement>
            <Input rounded="base" type="search" placeholder="Find a member" />
          </InputGroup>
        </FormControl>
      </HStack>
      <ButtonGroup size="sm" variant="outline">
        <Button
          backgroundColor="brand.500"
          color="#ffffff"
          iconSpacing="1"
          leftIcon={<RiAddFill fontSize="1.25em" />}
        >
          New member
        </Button>
      </ButtonGroup>
    </Stack>
  );
};
