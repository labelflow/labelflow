import {
  Image,
  HStack,
  VStack,
  Text,
  Box,
  Spinner,
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
      w="xs"
      borderRadius="lg"
      overflow="hidden"
      p="2"
      transition="background-color ease 0.2s"
      _hover={
        loading || disabled
          ? undefined
          : { backgroundColor: `${colorScheme}.50` }
      }
      cursor={disabled ? "not-allowed" : "pointer"}
      position="relative"
      onClick={disabled || loading ? undefined : onClick}
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
          backgroundColor={`${theme.colors[colorScheme][50]}99`}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Spinner size="xl" color="brand.500" aria-label="loading" />
        </Box>
      )}
      <HStack justifyContent="flex-start" alignItems="flex-end" spacing={4}>
        <Image src={logoSrc} w="16" h="16" />
        <VStack
          alignItems="flex-start"
          spacing="1"
          justifyContent="flex-end"
          height="100%"
        >
          <Text
            as="h3"
            color={disabled ? `gray.400` : "gray.800"}
            fontWeight="semibold"
            lineHeight="short"
          >
            {title}
          </Text>

          <Text
            fontSize="sm"
            lineHeight="short"
            color={disabled ? `gray.300` : "gray.600"}
          >
            {subtext}
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
};
