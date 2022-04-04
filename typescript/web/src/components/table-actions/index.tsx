import {
  Button,
  ButtonGroup,
  ButtonProps,
  chakra,
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { createContext, PropsWithChildren, useContext } from "react";
import { IconType } from "react-icons/lib";
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
            color={useColorModeValue("gray.400", "gray.200")}
          >
            <SearchIcon />
          </InputLeftElement>
          <Input
            data-testid="search-input"
            rounded="base"
            type="search"
            placeholder={searchBarLabel}
            bgColor={useColorModeValue("white", "gray.800")}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </InputGroup>
      </FormControl>
    </HStack>
  );
};

export type ActionButtonVariant = "brand" | "outline";

export type ActionButtonProps = Pick<ButtonProps, "onClick" | "disabled"> & {
  label: string;
  icon: IconType;
  variant: ActionButtonVariant;
};

export const TableActionButton = ({
  label,
  icon,
  variant,
  ...props
}: ActionButtonProps) => {
  const Icon = chakra(icon);
  const outlineBgColor = useColorModeValue("white", "gray.800");
  return (
    <Button
      variant="solid"
      iconSpacing="1"
      colorScheme={variant === "brand" ? "brand" : undefined}
      bgColor={variant === "outline" ? outlineBgColor : undefined}
      leftIcon={<Icon fontSize="md" />}
      {...props}
    >
      {label}
    </Button>
  );
};

const Buttons = ({ children }: PropsWithChildren<{}>) => {
  const { onNewItem, newButtonLabel } = useContext(TableActionsContext);
  return (
    <ButtonGroup size="sm" variant="outline">
      {children}
      <TableActionButton
        data-testid="add-button"
        variant="brand"
        icon={RiAddFill}
        onClick={onNewItem}
        label={newButtonLabel}
      />
    </ButtonGroup>
  );
};

export type TableActionsProps = PropsWithChildren<{
  searchText: string;
  setSearchText: (text: string) => void;
  onNewItem: () => void;
  searchBarLabel: string;
  newButtonLabel: string;
}>;

export const TableActions = ({ children, ...props }: TableActionsProps) => {
  return (
    <TableActionsContext.Provider value={props}>
      <Stack
        spacing="4"
        direction={{ base: "column", md: "row" }}
        justify="space-between"
      >
        <SearchBar />
        <Buttons>{children}</Buttons>
      </Stack>
    </TableActionsContext.Provider>
  );
};
