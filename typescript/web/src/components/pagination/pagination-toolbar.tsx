import {
  Center,
  HStack,
  SimpleGrid,
  SimpleGridProps,
  Text,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { PageNavigation } from "./page-navigation";
import { usePagination } from "./pagination.context";
import { PerPageInput } from "./per-page-input";

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
  <HStack alignItems="center">
    <Text>Items:</Text>
    <PerPageInput />
    <Range />
  </HStack>
);

export const PaginationToolbar = (props: SimpleGridProps) => (
  <SimpleGrid
    bg={mode("white", "gray.800")}
    paddingLeft={8}
    paddingRight={8}
    columns={{ base: 1, md: 3 }}
    paddingTop={{ base: 2, md: 0 }}
    {...props}
  >
    <ItemsDetails />
    <Center>
      <PageNavigation />
    </Center>
  </SimpleGrid>
);
