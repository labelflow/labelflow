import { Box } from "@chakra-ui/react";
import * as React from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";

import { NavBar } from "../../components/website/Navbar/NavBar";
import { Footer } from "../../components/website/Footer/Footer";
import { Meta } from "../../components/meta";
import { CookieBanner } from "../../components/cookie-banner";

const Iubenda = ({
  policyId,
  pageName,
  title,
}: {
  policyId: string;
  pageName: string;
  title: string;
}) => {
  useEffect(() => {
    const s = document.createElement("script");
    const tag = document.getElementsByTagName("script")[0];

    s.src = "https://cdn.iubenda.com/iubenda.js";

    tag?.parentNode?.insertBefore(s, tag);
  }, []);
  const iubendaPath = (() => {
    if (pageName === "terms-and-conditions") {
      return `terms-and-conditions/${policyId}`;
    }
    if (pageName === "cookie-policy") {
      return `privacy-policy/${policyId}/cookie-policy`;
    }
    if (pageName === "privacy-policy") {
      return `privacy-policy/${policyId}`;
    }
    return "";
  })();
  return (
    <a
      href={`https://www.iubenda.com/${iubendaPath}`}
      className="iubenda-nostyle no-brand iubenda-noiframe iubenda-embed iubenda-noiframe iub-body-embed"
      title={title}
    >
      {title}
    </a>
  );
};

export default function LegalPage() {
  const router = useRouter();
  const { pageName } = router?.query;

  const title = (() => {
    if (pageName === "terms-and-conditions") {
      return "Terms and conditions";
    }
    if (pageName === "cookie-policy") {
      return "Cookie policy";
    }
    if (pageName === "privacy-policy") {
      return "Privacy policy";
    }
    return "";
  })();
  return (
    <>
      <Meta title={`LabelFlow | ${title}`} />
      <CookieBanner />
      <Box minH="640px">
        <NavBar />
        <Box maxW="3xl" margin="auto" textAlign="justify">
          {pageName && (
            <Iubenda
              policyId="14507147"
              pageName={pageName as string}
              title={title}
            />
          )}
        </Box>
        <Footer />
      </Box>
    </>
  );
}
