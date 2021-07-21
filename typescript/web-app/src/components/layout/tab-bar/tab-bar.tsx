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
      padding={0}
      height="64px"
      flex={0}
      borderTop="1px solid"
      borderColor="gray.100"
      role="tablist"
    >
      {tabs.map(({ name, url, isActive }) => (
        <NextLink href={url} css="margin: 0;" key={name}>
          <chakra.button
            role="tab"
            fontSize="lg"
            textTransform="capitalize"
            display="flex"
            alignItems="center"
            justifyContent="center"
            paddingBottom="4"
            paddingTop="4"
            paddingInlineStart="4"
            paddingInlineEnd="4"
            margin="0"
            borderBottom="2px solid"
            color={isActive ? "brand.500" : "inherit"}
            borderColor={isActive ? "currentColor" : "transparent"}
            {...(isActive
              ? { "aria-current": "location", "aria-selected": "true" }
              : { "aria-selected": "false" })}
          >
            {name}
          </chakra.button>
        </NextLink>
      ))}
    </Flex>
  );
};
