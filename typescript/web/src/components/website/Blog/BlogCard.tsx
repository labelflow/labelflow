import {
  Box,
  Flex,
  Heading,
  Img,
  Link,
  LinkBox,
  LinkOverlay,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import * as React from "react";
import { BsClockFill } from "react-icons/bs";
import { getImageUrl } from "../get-image-url";

interface BlogProps {
  category: string;
  title: string;
  href: string;
  image: string;
  description: string;
  author: {
    name: string;
  };
}

export const BlogCard = (props: BlogProps) => {
  const { title, href, description, image, author, category } = props;
  return (
    <LinkBox
      as="article"
      bg={{ sm: useColorModeValue("white", "gray.700") }}
      shadow={{ sm: "base" }}
      rounded={{ sm: "md" }}
      overflow="hidden"
      transition="all 0.2s"
      _hover={{ shadow: { sm: "lg" } }}
    >
      <Flex direction="column">
        <Img
          height="60"
          objectFit="cover"
          alt={title}
          // FIXME The fallback image (initially home-screenshot2.jpg) does not exists
          src={image ?? getImageUrl("home-screenshot-2.jpg")}
        />
        <Flex direction="column" px={{ sm: "6" }} py="5">
          <Text
            casing="uppercase"
            letterSpacing="wider"
            fontSize="xs"
            fontWeight="semibold"
            mb="2"
            color="gray.500"
          >
            {category}
          </Text>
          <Heading as="h3" size="sm" mb="2" lineHeight="base">
            <LinkOverlay href={href}>{title}</LinkOverlay>
          </Heading>
          <Text
            noOfLines={2}
            mb="8"
            color={useColorModeValue("gray.600", "gray.400")}
          >
            {description}
          </Text>
          <Flex
            align="baseline"
            justify="space-between"
            fontSize="sm"
            color={useColorModeValue("gray.600", "gray.400")}
          >
            <Box>
              By <Box textDecor="underline">{author?.name}</Box>
            </Box>
            <Link href={href}>
              <Box
                as={BsClockFill}
                display="inline-block"
                me="2"
                opacity={0.4}
              />
              3 min read
            </Link>
          </Flex>
        </Flex>
      </Flex>
    </LinkBox>
  );
};
