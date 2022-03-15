import {
  Box,
  Center,
  chakra,
  HStack,
  HTMLChakraProps,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import * as React from "react";

interface SubmenuItemProps extends HTMLChakraProps<"a"> {
  title: string;
  icon?: React.ReactElement;
  children: React.ReactNode;
  href: string;
}

export const SubmenuItem = (props: SubmenuItemProps) => {
  const { title, icon, children, href, ...rest } = props;
  return (
    <chakra.a
      className="group"
      href={href}
      m="-3"
      p="3"
      display="flex"
      alignItems="flex-start"
      transition="all 0.2s"
      rounded="lg"
      _focus={{ shadow: "outline" }}
      {...rest}
    >
      <Center
        aria-hidden
        as="span"
        flexShrink={0}
        w="10"
        h="10"
        fontSize="3xl"
        color={useColorModeValue("brand.600", "brand.400")}
      >
        {icon}
      </Center>
      <Box marginStart="3" as="dl">
        <HStack as="dt">
          <Text
            fontWeight="semibold"
            color={useColorModeValue("gray.900", "white")}
            _groupHover={{ color: useColorModeValue("gray.500", "inherit") }}
          >
            {title}
          </Text>
        </HStack>
        <Text as="dd" color={useColorModeValue("gray.500", "gray.400")}>
          {children}
        </Text>
      </Box>
    </chakra.a>
  );
};
