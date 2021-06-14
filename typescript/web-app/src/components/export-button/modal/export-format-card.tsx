import {
  Image,
  HStack,
  VStack,
  Text,
  Tag,
  Box,
  Spinner,
} from "@chakra-ui/react";

type Props = {
  loading?: boolean;
  colorScheme: string;
  logoSrc: string;
  title: string;
  tag: string;
  subtext: string;
};

export const ExportFormatCard = ({
  colorScheme,
  logoSrc,
  title,
  tag,
  subtext,
  loading,
}: Props) => {
  return (
    <Box
      alignItems="flex-start"
      w="xs"
      borderWidth={1}
      borderRadius="lg"
      overflow="hidden"
      backgroundColor={`${colorScheme}.50`}
      borderColor={loading ? "gray.200" : `${colorScheme}.200`}
      p="2"
      transition="background-color ease 0.2s"
      _hover={loading ? undefined : { backgroundColor: `${colorScheme}.100` }}
      cursor="pointer"
      position="relative"
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
          backgroundColor="#ffffffdd"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Spinner size="lg" color="brand.500" />
        </Box>
      )}
      <HStack justifyContent="flex-start" alignItems="flex-end">
        <Image src={logoSrc} w="14" h="14" />
        <VStack
          alignItems="flex-start"
          spacing="1"
          justifyContent="flex-end"
          height="100%"
        >
          <Text
            as="h3"
            fontSize="lg"
            color="gray.800"
            fontWeight="semibold"
            lineHeight="short"
          >
            {title}
          </Text>
          <Tag
            mt="0"
            size="sm"
            borderRadius="full"
            variant="outline"
            color={`${colorScheme}.700`}
            // used to override chakra's default color
            // shadow color will fallback to `color`
            boxShadow="inset 0 0 0px 1px"
            fontWeight="bold"
          >
            {tag}
          </Tag>
        </VStack>
      </HStack>
      <Text lineHeight="short" color="gray.600" mt="2">
        {subtext}
      </Text>
    </Box>
  );
};
