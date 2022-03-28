import {
  Code,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useClipboard,
  VStack,
} from "@chakra-ui/react";
import { capitalCase } from "change-case";
import { useCallback, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { AppIcon, APP_ICONS, Icon as IconComponent, IconProps } from ".";
import { chakraDecorator, storybookTitle } from "../../../utils/stories";
import { useSuccessToast } from "../../toast";
import { SearchInput } from "../search-input";

export default {
  title: storybookTitle("Core", "Icons", "App icons"),
  decorators: [chakraDecorator],
};

type IconCodeProps = { text: string };

const IconCode = ({ text }: IconCodeProps) => (
  <Td>
    <Code fontSize="sm" textAlign="center">
      {text}
    </Code>
  </Td>
);

type IconItemProps<TName extends AppIcon> = {
  name: AppIcon;
  icon: typeof APP_ICONS[TName];
};

const IconDescription = <TName extends AppIcon>({
  name,
  icon,
}: IconItemProps<TName>) => (
  <>
    <Td>{capitalCase(name)}</Td>
    <IconCode text={name} />
    <IconCode text={icon.name} />
  </>
);

const IconCell = (props: IconProps) => (
  <Td>
    <IconComponent {...props} />
  </Td>
);

const IconItem = <TName extends AppIcon>({
  name,
  icon,
}: IconItemProps<TName>) => {
  const showToast = useSuccessToast({
    title: "Copied to clipboard",
  });
  const { onCopy } = useClipboard(name);
  const handleClick = useCallback(async () => {
    await onCopy();
    showToast();
  }, [onCopy, showToast]);
  return (
    <Tr cursor="pointer" onClick={handleClick}>
      <IconCell name={name} />
      <IconDescription name={name} icon={icon} />
    </Tr>
  );
};

const TableHead = () => (
  <Thead>
    <Tr>
      {["Icon", "Name", "AppIcon", "SVG"].map((name) => (
        <Th key={name}>{name}</Th>
      ))}
    </Tr>
  </Thead>
);

const SORTED_ICONS = Object.entries(APP_ICONS).sort(([a], [b]) =>
  a > b ? 1 : -1
);

type IconsTableProps = { filter: string };

const useFilter = ({ filter }: IconsTableProps) => {
  const [debounced] = useDebounce(filter, 500, {
    leading: true,
    trailing: true,
  });
  return useMemo(() => {
    const lowerFilter = debounced.toLowerCase();
    return SORTED_ICONS.filter(
      ([name, icon]) =>
        name.toLowerCase().includes(lowerFilter) ||
        icon.name.toLowerCase().includes(lowerFilter)
    );
  }, [debounced]);
};

const TableBody = ({ filter }: IconsTableProps) => {
  const filtered = useFilter({ filter });
  return (
    <Tbody>
      {filtered.map(([name, icon]) => (
        <IconItem key={name} name={name as AppIcon} icon={icon} />
      ))}
    </Tbody>
  );
};

const IconsTable = ({ filter }: IconsTableProps) => (
  <Table>
    <TableHead />
    <TableBody filter={filter} />
  </Table>
);

export const AppIcons = () => {
  const [filter, setFilter] = useState("");
  return (
    <VStack maxW="3xl">
      <SearchInput value={filter} onChange={setFilter} />
      <IconsTable filter={filter} />
    </VStack>
  );
};
