import { Box, Image, HStack, VStack, Text, Tag } from "@chakra-ui/react";

type Props = { colorScheme?: string };

export const ExportFormatCard = ({ colorScheme = "brand" }: Props) => {
  return (
    <VStack
      maxW="xs"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      backgroundColor={`${colorScheme}.50`}
      borderColor={`${colorScheme}.200`}
      p="2"
      transition="background-color ease 0.2s"
      _hover={{ backgroundColor: `${colorScheme}.100` }}
      alignItems="flex-start"
    >
      <HStack justifyContent="flex-start">
        <Image src="/assets/export-formats/coco.png" w="16" h="16" />
        <VStack>
          <Text as="h3" fontWeight="semibold" lineHeight="short">
            Coco
          </Text>
          <Tag borderRadius="full" variant="outline" colorScheme={colorScheme}>
            JSON
          </Tag>
        </VStack>
      </HStack>
      <Text lineHeight="short" fontWeight="light" mt="0">
        Annotation file used with Pytorch and Detectron 2
      </Text>
    </VStack>
  );
};
