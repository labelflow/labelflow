import { chakra, Flex } from "@chakra-ui/react";
import NextLink from "next/link";

export type TabBarItem = {
  name: string;
  url: string;
  isActive: boolean;
};

export type Props = {
  tabs: Array<TabBarItem>;
};

export const TabBar = ({ tabs }: Props) => {
  if (!tabs || tabs.length === 0) {
    return <></>;
  }

  return (
    <Flex
      alignItems="center"
      bg="gray.100"
      padding={0}
      h="64px"
      flex={0}
      borderBottom="2px solid"
      borderColor="gray.200"
      aria-label="tab bar"
    >
      {tabs.map(({ name, url, isActive }) => (
        <NextLink href={url} css="margin: 0;" key={name}>
          <chakra.button
            fontSize="lg"
            textTransform="capitalize"
            display="flex"
            alignItems="center"
            justifyContent="center"
            paddingBottom="4"
            paddingTop="4"
            paddingInlineStart="4"
            paddingInlineEnd="4"
            mt="0"
            mr="0"
            ml="0"
            mb="-2px"
            borderBottom="2px solid"
            color={isActive ? "brand.500" : "inherit"}
            borderColor={isActive ? "currentColor" : "inherit"}
            {...(isActive ? { "aria-current": "location" } : {})}
          >
            {name}
          </chakra.button>
        </NextLink>
      ))}
    </Flex>
  );
};
