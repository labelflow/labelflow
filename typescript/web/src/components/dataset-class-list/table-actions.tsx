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
import { UpsertClassModal } from "./upsert-class-modal";

const SearchIcon = chakra(IoSearch);

export const ClassTableActions = ({
  searchText,
  setSearchText,
  isCreatingClassLabel,
  setIsCreatingClassLabel,
  datasetId,
  datasetSlug,
  workspaceSlug,
}: {
  searchText: string;
  setSearchText: (text: string) => void;
  isCreatingClassLabel: boolean;
  setIsCreatingClassLabel: (value: boolean) => void;
  datasetId: string | null | undefined;
  datasetSlug: string;
  workspaceSlug: string;
}) => {
  return (
    <>
      <UpsertClassModal
        isOpen={isCreatingClassLabel}
        onClose={() => setIsCreatingClassLabel(false)}
        datasetId={datasetId}
        datasetSlug={datasetSlug}
        workspaceSlug={workspaceSlug}
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
            onClick={() => setIsCreatingClassLabel(true)}
          >
            New class
          </Button>
        </ButtonGroup>
      </Stack>
    </>
  );
};
