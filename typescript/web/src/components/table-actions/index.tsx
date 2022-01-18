import {
  Button,
  ButtonGroup,
  chakra,
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { createContext, useContext } from "react";
import { IoSearch } from "react-icons/io5";
import { RiAddFill } from "react-icons/ri";

const SearchIcon = chakra(IoSearch);

type TableActionsState = TableActionsProps;

const TableActionsContext = createContext({} as TableActionsState);

const SearchBar = () => {
  const { searchBarLabel, searchText, setSearchText } =
    useContext(TableActionsContext);
  return (
    <HStack>
      <FormControl minW={{ md: "320px" }} id="search">
        <InputGroup size="sm">
          <FormLabel srOnly>{searchBarLabel}</FormLabel>
          <InputLeftElement
            pointerEvents="none"
            color={mode("gray.400", "gray.200")}
          >
            <SearchIcon />
          </InputLeftElement>
          <Input
            rounded="base"
            type="search"
            placeholder={searchBarLabel}
            bgColor={mode("white", "gray.800")}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </InputGroup>
      </FormControl>
    </HStack>
  );
};

const NewItemButton = () => {
  const { onNewItem, newButtonLabel } = useContext(TableActionsContext);
  return (
    <ButtonGroup size="sm" variant="outline">
      <Button
        colorScheme="brand"
        variant="solid"
        iconSpacing="1"
        leftIcon={<RiAddFill fontSize="1.25em" />}
        onClick={onNewItem}
      >
        {newButtonLabel}
      </Button>
    </ButtonGroup>
  );
};

export type TableActionsProps = {
  searchText: string;
  setSearchText: (text: string) => void;
  onNewItem: () => void;
  searchBarLabel: string;
  newButtonLabel: string;
};

export const TableActions = (props: TableActionsProps) => {
  return (
    <TableActionsContext.Provider value={props}>
      <Stack
        spacing="4"
        direction={{ base: "column", md: "row" }}
        justify="space-between"
      >
        <SearchBar />
        <NewItemButton />
      </Stack>
    </TableActionsContext.Provider>
  );
};
