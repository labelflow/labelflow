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
  useColorModeValue as mode,
} from "@chakra-ui/react";
// import { useState } from "react";
import { RiAddFill } from "react-icons/ri";
import { UpsertClassModal } from "./upsert-class-modal";

const SearchIcon = chakra(IoSearch);

export const ClassTableActions = ({
  searchText,
  setSearchText,
  isCreatingClassLabel,
  setIsCreatingClassLabel,
  datasetId,
  datasetSlug,
}: {
  searchText: string;
  setSearchText: (text: string) => void;
  isCreatingClassLabel: boolean;
  setIsCreatingClassLabel: (value: boolean) => void;
  datasetId: string | null | undefined;
  datasetSlug: string;
}) => {
  return (
    <>
      <UpsertClassModal
        isOpen={isCreatingClassLabel}
        onClose={() => setIsCreatingClassLabel(false)}
        datasetId={datasetId}
        datasetSlug={datasetSlug}
      />
      <Stack
        spacing="4"
        direction={{ base: "column", md: "row" }}
        justify="space-between"
      >
        <HStack>
          <FormControl minW={{ md: "320px" }} id="search">
            <InputGroup size="sm">
              <FormLabel srOnly>Find a member</FormLabel>
              <InputLeftElement
                pointerEvents="none"
                color={mode("gray.400", "gray.200")}
              >
                <SearchIcon />
              </InputLeftElement>
              <Input
                rounded="base"
                type="search"
                placeholder="Find a class"
                bgColor={mode("white", "gray.800")}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </InputGroup>
          </FormControl>
        </HStack>
        <ButtonGroup size="sm" variant="outline">
          <Button
            colorScheme="brand"
            variant="solid"
            iconSpacing="1"
            leftIcon={<RiAddFill fontSize="1.25em" />}
            onClick={() => setIsCreatingClassLabel(true)}
          >
            New class
          </Button>
        </ButtonGroup>
      </Stack>
    </>
  );
};
