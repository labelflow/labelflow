import {
  Box,
  Heading,
  Link,
  SimpleGrid,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import * as React from "react";
import { BsArrowRight } from "react-icons/bs";
import { BlogCard } from "./BlogCard";
import { Article } from "../../../connectors/strapi";

export const BlogPreview = ({
  previewArticles,
}: {
  previewArticles: Omit<Article, "content">[];
}) => {
  return (
    <Box
      as="section"
      bg={mode("gray.50", "gray.800")}
      py={{ base: "10", sm: "24" }}
    >
      <Box
        maxW={{ base: "xl", md: "7xl" }}
        mx="auto"
        px={{ base: "6", md: "8" }}
      >
        <Heading size="xl" mb="8" fontWeight="extrabold">
          Featured Articles
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing="12" mb="10">
          {previewArticles.map((article) => (
            <BlogCard
              category={article?.category?.name}
              image={article?.image?.url}
              title={article?.title}
              description={article?.description}
              href={`/posts/${article?.slug}`}
              author={article?.author}
            />
          ))}
        </SimpleGrid>
        <Link
          fontSize="xl"
          fontWeight="bold"
          color={mode("blue.600", "blue.400")}
          href="/posts"
        >
          <span>View all articles</span>
          <Box as={BsArrowRight} display="inline-block" ms="2" />
        </Link>
      </Box>
    </Box>
  );
};