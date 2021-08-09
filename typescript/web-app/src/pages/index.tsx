import { useEffect } from "react";
import { GetServerSideProps } from "next";
import { useCookie } from "next-cookie";
import { Spinner, Center } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { join, map, toPairs, isEmpty } from "lodash/fp";
import { Layout } from "../components/layout";
import Website from "./website";

const IndexPage = ({ cookie }: { cookie: string }) => {
  const router = useRouter();

  const parsedCookie = useCookie(cookie);
  const hasUserTriedApp = parsedCookie.get("hasUserTriedApp");

  useEffect(() => {
    if (hasUserTriedApp) {
      router.replace({ pathname: "/projects", query: router.query });
    }
  }, [hasUserTriedApp]);

  if (!hasUserTriedApp) {
    return <Website />;
  }

  return (
    <Layout>
      <Center h="full">
        <Spinner size="xl" />
      </Center>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const parsedCookie = useCookie(context);

  if (parsedCookie.get("hasUserTriedApp")) {
    return {
      redirect: {
        // Keep query params after redirect
        destination: `/projects${
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

  return {
    props: {
      cookie: context.req.headers.cookie || "",
    },
  };
};

export default IndexPage;
