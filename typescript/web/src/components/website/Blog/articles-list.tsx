import {
  Box,
  Heading,
  Link,
  SimpleGrid,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import * as React from "react";
import { BsArrowRight } from "react-icons/bs";
import { BlogCard } from "./BlogCard";
import { Article } from "../../../connectors/strapi";

export const ArticlesList = ({
  previewArticles,
  preview = false,
}: {
  previewArticles: Omit<Article, "content">[];
  preview?: boolean;
}) => {
  const discoverColor = useColorModeValue("gray.600", "gray.400");
  const viewAllArticlesColor = useColorModeValue("brand.600", "brand.400");
  return (
    <Box
      as="section"
      bg={useColorModeValue("gray.50", "gray.800")}
      py={{ base: "10", sm: "24" }}
    >
      <Box
        maxW={{ base: "xl", md: "7xl" }}
        mx="auto"
        px={{ base: "6", md: "8" }}
      >
        {preview ? (
          <Heading size="xl" mb="8" fontWeight="extrabold">
            Featured Articles
          </Heading>
        ) : (
          <Box textAlign="center" maxW="md" mx="auto">
            <Heading size="2xl" fontWeight="extrabold" letterSpacing="tight">
              LabelFlow Blog
            </Heading>
            <Text mt="4" fontSize="lg" color={discoverColor}>
              Discover the latest news and tech from our team and around
              artificial intelligence
            </Text>
          </Box>
        )}
        <SimpleGrid
          columns={{ base: 1, md: 3 }}
          spacing="12"
          mb="10"
          mt={!preview ? "14" : undefined}
        >
          {previewArticles?.map((article) => (
            <BlogCard
              key={article?.slug}
              category={article?.category?.name}
              image={article?.image?.url}
              title={article?.title}
              description={article?.description}
              href={`/posts/${article?.slug}`}
              author={article?.author}
            />
          ))}
        </SimpleGrid>
        {preview && (
          <Link
            fontSize="xl"
            fontWeight="bold"
            color={viewAllArticlesColor}
            href="/posts"
          >
            <span>View all articles</span>
            <Box as={BsArrowRight} display="inline-block" ms="2" />
          </Link>
        )}
      </Box>
    </Box>
  );
};
