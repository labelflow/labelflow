import {
  Box,
  chakra,
  HStack,
  Image,
  Link,
  Text,
  useColorModeValue,
  useTheme,
  VStack,
} from "@chakra-ui/react";
import { isEmpty } from "lodash/fp";
import { IconType } from "react-icons/lib";
import { OptionalParent } from "../../../utils";
import { Spinner } from "../../core";

export type ExportCardProps = {
  disabled?: boolean;
  colorScheme: string;
  href?: string;
  onClick?: () => void;
  loading?: boolean;
  logoSrc?: string;
  logoIcon?: IconType;
  title: string;
  subtext: string;
};

const ExportLogoIcon = ({
  logoSrc,
  logoIcon,
}: Pick<ExportCardProps, "logoSrc" | "logoIcon">) => {
  const LogoIcon = logoIcon ? chakra(logoIcon) : undefined;
  const logoColor = useColorModeValue("black", "white");
  return LogoIcon ? (
    <LogoIcon fontSize="64" color={logoColor} flexGrow={0} flexShrink={0} />
  ) : (
    <Image src={logoSrc} w="16" flexGrow={0} flexShrink={0} />
  );
};

type UseCardColorsOptions = Pick<ExportCardProps, "colorScheme" | "disabled">;

type UseCardColorsResult = Record<
  | "loadingBackgroundColor"
  | "hoverBackgroundColor"
  | "titleColor"
  | "subtitleColor",
  string
>;

const useCardColors = ({
  colorScheme,
  disabled,
}: UseCardColorsOptions): UseCardColorsResult => {
  const theme = useTheme();
  const titleColors: [string, string] = disabled
    ? ["gray.400", "gray.500"]
    : ["gray.800", "gray.200"];
  const subtitleColors: [string, string] = disabled
    ? ["gray.300", "gray.600"]
    : ["gray.600", "gray.400"];
  return {
    loadingBackgroundColor:
      theme.colors[colorScheme][useColorModeValue(50, 800)],
    hoverBackgroundColor: useColorModeValue(
      `${colorScheme}.50`,
      `${colorScheme}.800`
    ),
    titleColor: useColorModeValue(...titleColors),
    subtitleColor: useColorModeValue(...subtitleColors),
  };
};

export const ExportCard = ({
  colorScheme,
  disabled,
  onClick,
  href,
  loading,
  logoSrc,
  logoIcon,
  title,
  subtext,
}: ExportCardProps) => {
  const {
    titleColor,
    subtitleColor,
    loadingBackgroundColor,
    hoverBackgroundColor,
  } = useCardColors({ colorScheme, disabled });
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
            : { backgroundColor: hoverBackgroundColor }
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
            backgroundColor={`${loadingBackgroundColor}99`}
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
          <ExportLogoIcon logoSrc={logoSrc} logoIcon={logoIcon} />
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
              color={titleColor}
              fontWeight="semibold"
              lineHeight="short"
            >
              {title}
            </Text>

            <Text
              fontSize="smaller"
              lineHeight="short"
              letterSpacing="tight"
              color={subtitleColor}
            >
              {subtext}
            </Text>
          </VStack>
        </HStack>
      </Box>
    </OptionalParent>
  );
};
