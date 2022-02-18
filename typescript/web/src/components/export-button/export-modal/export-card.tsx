import {
  Box,
  HStack,
  Image,
  Link,
  Text,
  useColorModeValue as mode,
  useTheme,
  VStack,
} from "@chakra-ui/react";
import { isEmpty } from "lodash/fp";
import { OptionalParent } from "../../../utils";
import { Spinner } from "../../spinner";

export type ExportCardProps = {
  disabled?: boolean;
  colorScheme: string;
  href?: string;
  onClick?: () => void;
  loading?: boolean;
  logoSrc: string;
  title: string;
  subtext: string;
};

export const ExportCard = ({
  colorScheme,
  disabled,
  onClick,
  href,
  loading,
  logoSrc,
  title,
  subtext,
}: ExportCardProps) => {
  const theme = useTheme();

  return (
    <OptionalParent
      enabled={!isEmpty(href)}
      parent={Link}
      parentProps={{
        href,
        rel: "noreferrer",
        isExternal: true,
        tabIndex: -1,
        style: { textDecoration: "none" },
      }}
    >
      <Box
        alignItems="flex-start"
        w={{ base: "2xs", md: "xs" }}
        borderRadius="lg"
        overflow="hidden"
        p="2"
        transition="background-color ease 0.2s"
        _hover={
          loading || disabled
            ? undefined
            : {
                backgroundColor: mode(
                  `${colorScheme}.50`,
                  `${colorScheme}.800`
                ),
              }
        }
        cursor={disabled ? "not-allowed" : "pointer"}
        position="relative"
        onClick={disabled || loading ? undefined : onClick}
        boxSizing="border-box"
      >
        {loading && (
          <Box
            w="100%"
            h="100%"
            position="absolute"
            top="0"
            bottom="0"
            left="0"
            right="0"
            backgroundColor={`${theme.colors[colorScheme][mode(50, 800)]}99`}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Spinner color="brand.500" size="xl" aria-label="loading" />
          </Box>
        )}
        <HStack
          justifyContent="flex-start"
          alignItems="center"
          spacing={4}
          boxSizing="border-box"
        >
          <Image src={logoSrc} w="16" flexGrow={0} flexShrink={0} />
          <VStack
            alignItems="flex-start"
            spacing="1"
            justifyContent="flex-start"
            boxSizing="border-box"
            flexGrow={1}
            flexShrink={1}
          >
            <Text
              as="h3"
              color={
                disabled
                  ? mode("gray.400", "gray.500")
                  : mode("gray.800", "gray.200")
              }
              fontWeight="semibold"
              lineHeight="short"
            >
              {title}
            </Text>

            <Text
              fontSize="smaller"
              lineHeight="short"
              letterSpacing="tight"
              color={
                disabled
                  ? mode("gray.300", "gray.600")
                  : mode("gray.600", "gray.400")
              }
            >
              {subtext}
            </Text>
          </VStack>
        </HStack>
      </Box>
    </OptionalParent>
  );
};
