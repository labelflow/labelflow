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
import { RiAddFill } from "react-icons/ri";
import { UpsertClassModal } from "./upsert-class-modal";
import { useLabelClasses } from "./label-classes.context";

const SearchIcon = chakra(IoSearch);

export const LabelClassesActions = () => {
  const { searchText, setSearchText, isCreating, setIsCreating } =
    useLabelClasses();
  return (
    <>
      <UpsertClassModal
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
      />
      <Stack
        spacing="4"
        direction={{ base: "column", md: "row" }}
        justify="space-between"
      >
        <HStack>
          <FormControl minW={{ md: "320px" }} id="search">
            <InputGroup size="sm">
              <FormLabel srOnly>Find a class</FormLabel>
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
            onClick={() => setIsCreating(true)}
          >
            New class
          </Button>
        </ButtonGroup>
      </Stack>
    </>
  );
};
