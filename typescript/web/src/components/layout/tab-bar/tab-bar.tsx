import { chakra, Flex, Tooltip, useColorModeValue } from "@chakra-ui/react";
import NextLink from "next/link";
import { useWorkspace } from "../../../hooks";

export type TabBarItem = {
  name: string;
  url: string;
  isActive: boolean;
};

export type TabBarProps = {
  tabs: Array<TabBarItem>;
};

const DisabledSettingsLink = () => {
  return (
    <Tooltip label="No settings available for the local workspace">
      {/* The span is needed to add a tooltip on a disabled button */}
      <span>
        <chakra.button
          disabled
          cursor="not-allowed"
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
          opacity={0.4}
          color="inherit"
          aria-selected="false"
          borderColor="transparent"
        >
          Settings
        </chakra.button>
      </span>
    </Tooltip>
  );
};

export const TabBarBody = ({ tabs }: TabBarProps) => {
  const { slug: workspaceSlug } = useWorkspace();
  return (
    <Flex
      alignItems="center"
      padding={0}
      height="44px"
      flex={0}
      borderTop="1px solid"
      borderColor={useColorModeValue("gray.100", "gray.700")}
      role="tablist"
    >
      {tabs.map(({ name, url, isActive }) => {
        if (workspaceSlug === "local" && name === "settings") {
          return <DisabledSettingsLink key="settings" />;
        }

        return (
          <NextLink href={url} key={name}>
            <chakra.button
              role="tab"
              fontSize="lg"
              textTransform="capitalize"
              display="flex"
              alignItems="center"
              justifyContent="center"
              py="2"
              paddingInlineStart="5"
              paddingInlineEnd="5"
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
        );
      })}
    </Flex>
  );
};

export const TabBar = ({ tabs }: TabBarProps) => (
  <>{tabs.length > 0 && <TabBarBody tabs={tabs} />}</>
);
