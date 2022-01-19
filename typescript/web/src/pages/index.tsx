import { isEmpty, join, map, toPairs } from "lodash/fp";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Cookies, useCookies } from "react-cookie";
import { CookieBanner } from "../components/cookie-banner";
import { Layout } from "../components/layout";
import { Meta } from "../components/meta";
import { ServiceWorkerManagerBackground } from "../components/service-worker-manager";
import { LayoutSpinner } from "../components/spinner";
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
  }, [hasUserTriedApp, router]);

  if (!hasUserTriedApp) {
    return <Website previewArticles={[]} />;
  }

  return (
    <>
      <ServiceWorkerManagerBackground />
      <Meta title="LabelFlow: The open standard platform for image labeling." />
      <CookieBanner />
      <Layout>
        <LayoutSpinner />
      </Layout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const parsedCookie = new Cookies(context.req.headers.cookie);

  if (parsedCookie.get("hasUserTriedApp") === "true") {
    const workspaceSlug =
      parsedCookie.get("lastVisitedWorkspaceSlug") ?? "local";
    return {
      props: {},
      redirect: {
        // Keep query params after redirect
        destination: `/${workspaceSlug}/datasets${
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
