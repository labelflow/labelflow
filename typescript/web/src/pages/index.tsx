import { useEffect } from "react";
import { GetServerSideProps } from "next";
import { useCookie } from "next-cookie";
import { Spinner, Center } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { join, map, toPairs, isEmpty } from "lodash/fp";
import { Layout } from "../components/layout";
import { Article, getAllArticles } from "../connectors/strapi";
import Website from "./website";

const IndexPage = ({
  cookie,
  previewArticles,
}: {
  cookie: string;
  previewArticles: Omit<Article, "content">[];
}) => {
  const router = useRouter();

  const parsedCookie = useCookie(cookie);
  const hasUserTriedApp = parsedCookie.get("hasUserTriedApp");

  useEffect(() => {
    if (hasUserTriedApp) {
      router.replace({ pathname: "/datasets", query: router.query });
    }
  }, [hasUserTriedApp]);

  if (!hasUserTriedApp) {
    return <Website previewArticles={previewArticles} />;
  }

  return (
    <Layout>
      <Center h="full">
        <Spinner size="xl" />
      </Center>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context
): Promise<{
  [key: string]: any;
  props: { previewArticles: Omit<Article, "content">[] };
}> => {
  const previewArticles = (await getAllArticles({ limit: 3 })) || [];
  const parsedCookie = useCookie(context);

  if (parsedCookie.get("hasUserTriedApp")) {
    return {
      props: { previewArticles },
      redirect: {
        // Keep query params after redirect
        destination: `/datasets${
          isEmpty(context.query)
            ? ""
            : `?${join(
                "&",
                map(([key, value]) => `${key}=${value}`, toPairs(context.query))
              )}`
        }`,
        permanent: false,
      },
    };
  }

  return { props: { previewArticles } };
};

export default IndexPage;
