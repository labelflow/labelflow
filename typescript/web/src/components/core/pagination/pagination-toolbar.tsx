import {
  Center,
  Flex,
  HStack,
  SimpleGrid,
  SimpleGridProps,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { PageNavigation } from "./page-navigation";
import { usePagination } from "./pagination.context";
import { PerPageInput } from "./per-page-input";

type LeftLabelProps = { leftLabel?: string };

const LeftLabel = ({ leftLabel }: LeftLabelProps) => (
  <Flex align="center">
    <Text>{leftLabel}</Text>
  </Flex>
);
const Range = () => {
  const { page, total, itemCount, perPage } = usePagination();
  const skip = (page - 1) * perPage;
  return (
    <Text textAlign="center" whiteSpace="nowrap">
      {skip + 1}-{page === total ? itemCount : skip + perPage} of {itemCount}
    </Text>
  );
};

const ItemsDetails = () => (
  <HStack alignItems="center" justifyContent="flex-end">
    <Text>Items:</Text>
    <PerPageInput />
    <Range />
  </HStack>
);

const Body = ({ leftLabel }: LeftLabelProps) => (
  <>
    <LeftLabel leftLabel={leftLabel} />
    <Center>
      <PageNavigation />
    </Center>
    <ItemsDetails />
  </>
);

export type PaginationToolbarProps = SimpleGridProps & LeftLabelProps;

export const PaginationToolbar = ({
  leftLabel = "",
  ...props
}: PaginationToolbarProps) => (
  <SimpleGrid
    bg={useColorModeValue("white", "gray.800")}
    paddingLeft={8}
    paddingRight={8}
    columns={{ base: 1, md: 3 }}
    paddingTop={{ base: 2, md: 0 }}
    {...props}
  >
    <Body leftLabel={leftLabel} />
  </SimpleGrid>
);
