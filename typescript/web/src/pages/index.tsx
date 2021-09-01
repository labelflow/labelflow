import { useEffect } from "react";
import { GetServerSideProps } from "next";
import { Cookies, useCookies } from "react-cookie";
import { Spinner, Center } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { join, map, toPairs, isEmpty } from "lodash/fp";
import { Meta } from "../components/meta";
import { Layout } from "../components/layout";
import Website from "./website";

const IndexPage = () => {
  const router = useRouter();

  const [cookies] = useCookies(["hasUserTriedApp"]);
  const hasUserTriedApp = cookies.hasUserTriedApp === "true";

  useEffect(() => {
    if (hasUserTriedApp) {
      router.replace({ pathname: "/local/datasets", query: router.query });
    } else {
      router.replace({ pathname: "/website", query: router.query });
    }
  }, [hasUserTriedApp]);

  if (!hasUserTriedApp) {
    return <Website previewArticles={[]} />;
  }

  return (
    <>
      <Meta title="LabelFlow: The open standard platform for image labelling." />
      <Layout>
        <Center h="full">
          <Spinner size="xl" />
        </Center>
      </Layout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const parsedCookie = new Cookies(context.req.headers.cookie);

  if (parsedCookie.get("hasUserTriedApp") === "true") {
    return {
      props: {},
      redirect: {
        // Keep query params after redirect
        destination: `/local/datasets${
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
    props: {},
    redirect: {
      // Keep query params after redirect
      destination: `/website${
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
};

export default IndexPage;
