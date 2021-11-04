import {
  Image,
  HStack,
  VStack,
  Text,
  Box,
  Spinner,
  useColorModeValue as mode,
  useTheme,
} from "@chakra-ui/react";

type Props = {
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  colorScheme: string;
  logoSrc: string;
  title: string;
  subtext: string;
};

export const ExportFormatCard = ({
  colorScheme,
  logoSrc,
  title,
  subtext,
  loading,
  disabled,
  onClick,
}: Props) => {
  const theme = useTheme();
  return (
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
          : { backgroundColor: mode(`${colorScheme}.50`, `${colorScheme}.800`) }
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
          <Spinner size="xl" color="brand.500" aria-label="loading" />
        </Box>
      )}
      <HStack
        justifyContent="flex-start"
        alignItems="center"
        spacing={4}
        boxSizing="border-box"
      >
        <Image
          src={logoSrc}
          crossOrigin="anonymous"
          w="16"
          flexGrow={0}
          flexShrink={0}
        />
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
  );
};
