import { Image, HStack, VStack, Text, Tag } from "@chakra-ui/react";

type Props = { colorScheme?: string };

export const ExportFormatCard = ({ colorScheme = "brand" }: Props) => {
  return (
    <VStack
      alignItems="flex-start"
      maxW="xs"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      backgroundColor={`${colorScheme}.50`}
      borderColor={`${colorScheme}.200`}
      p="2"
      transition="background-color ease 0.2s"
      _hover={{ backgroundColor: `${colorScheme}.100` }}
      cursor="pointer"
    >
      <HStack justifyContent="flex-start" alignItems="flex-end">
        <Image src="/assets/export-formats/coco.png" w="14" h="14" />
        <VStack
          alignItems="flex-start"
          spacing="1"
          justifyContent="flex-end"
          height="100%"
        >
          <Text as="h3" fontSize="lg" fontWeight="semibold" lineHeight="short">
            Export to COCO
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
            JSON
          </Tag>
        </VStack>
      </HStack>
      <Text lineHeight="short" color="gray.600" mt="0">
        Annotation file used with Pytorch and Detectron 2
      </Text>
    </VStack>
  );
};
