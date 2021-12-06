import { IoSearch } from "react-icons/io5";
import {
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  chakra,
} from "@chakra-ui/react";
// import { useState } from "react";
import { RiAddFill } from "react-icons/ri";

const SearchIcon = chakra(IoSearch);

export const ClassTableActions = ({
  searchText,
  setSearchText,
}: {
  searchText: string;
  setSearchText: (text: string) => void;
}) => {
  return (
    <>
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
              <Input
                rounded="base"
                type="search"
                placeholder="Find a class"
                bgColor="#FFFFFF"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </InputGroup>
          </FormControl>
        </HStack>
        <ButtonGroup size="sm" variant="outline">
          <Button
            backgroundColor="brand.500"
            color="#ffffff"
            iconSpacing="1"
            leftIcon={<RiAddFill fontSize="1.25em" />}
            // TODO: Add the modal
            onClick={() => console.log("coucou")}
          >
            New class
          </Button>
        </ButtonGroup>
      </Stack>
    </>
  );
};
