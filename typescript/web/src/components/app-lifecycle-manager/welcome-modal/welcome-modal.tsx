import { useRef, useEffect, useCallback, useState } from "react";
import { ApolloClient, gql, useApolloClient } from "@apollo/client";
import { useCookies } from "react-cookie";
import { Modal, ModalOverlay } from "@chakra-ui/react";
import { useErrorHandler } from "react-error-boundary";
import { QueryParamConfig, StringParam, useQueryParam } from "use-query-params";
import type { Dataset as DatasetType } from "@labelflow/graphql-types";
import { useRouter } from "next/router";
import { browser } from "../../../utils/detect-scope";
import { WrongBrowser } from "./steps/wrong-browser";
import { Welcome } from "./steps/welcome";
import { Loading } from "./steps/loading";
import {
  checkServiceWorkerReady,
  messageNoWindow,
} from "../../../utils/check-service-worker";

type WelcomeModalParam =
  | undefined // Default: Stays close if user already onboarded, else open asap
  | "open" // Force it to open asap
  | "closed"; // Force it to be closed and never open

export const getDatasetsQuery = gql`
  query getDatasets {
    datasets {
      id
      name
    }
  }
`;

export const createDemoDatasetQuery = gql`
  mutation createDemoDataset {
    createDemoDataset {
      id
      name
      images(first: 1) {
        id
        url
      }
      imagesAggregates {
        totalCount
      }
      labelsAggregates {
        totalCount
      }
      labelClassesAggregates {
        totalCount
      }
    }
  }
`;

const performWelcomeWorkflow = async ({
  isServiceWorkerActive,
  setIsServiceWorkerActive,
  client,
  setParamModalWelcome,
  setIsLoadingWorkerAndDemo,
  setHasUserTriedApp,
  handleError,
}: {
  isServiceWorkerActive: boolean;
  setIsServiceWorkerActive: (state: boolean) => void;
  setParamModalWelcome: (
    state: WelcomeModalParam,
    updateType: "replaceIn"
  ) => void;
  setIsLoadingWorkerAndDemo: (state: boolean) => void;
  client: ApolloClient<{}>;
  setHasUserTriedApp: any;
  handleError: (error: Error) => void;
}) => {
  try {
    if (isServiceWorkerActive) {
      return;
    }
    console.log("setParamModalWelcome(undefined, replaceIn);", 1);
    setParamModalWelcome(undefined, "replaceIn");

    setIsLoadingWorkerAndDemo(true);

    try {
      await checkServiceWorkerReady();
    } catch (e) {
      if (e.message === messageNoWindow) {
        return;
      }
      throw e;
    }
    setIsServiceWorkerActive(true);

    const { data: getDatasetsResult } = await client.query({
      query: getDatasetsQuery,
    });

    const demoDataset =
      getDatasetsResult?.datasets == null
        ? undefined
        : getDatasetsResult?.datasets.filter(
            (dataset: DatasetType) => dataset.name === "Demo dataset"
          )?.[0] ?? undefined;

    if (!demoDataset) {
      const { data: createDemoDatasetResult, errors: createDemoDatasetErrors } =
        await client.mutate({
          mutation: createDemoDatasetQuery,
        });
      if (createDemoDatasetErrors) {
        throw createDemoDatasetErrors[0];
      }
    }

    setHasUserTriedApp("hasUserTriedApp", "true", {
      path: "/",
      httpOnly: false,
    });
    setIsLoadingWorkerAndDemo(false);
  } catch (error) {
    handleError(error);
  }
};

export const WelcomeModal = ({
  initialIsServiceWorkerActive = false,
  initialIsWrongBrowser = false,
  initialIsLoadingWorkerAndDemo = false,
}: {
  initialIsServiceWorkerActive?: boolean;
  initialIsWrongBrowser?: boolean;
  initialIsLoadingWorkerAndDemo?: boolean;
}) => {
  const router = useRouter();
  const handleError = useErrorHandler();
  const client = useApolloClient();
  const startLabellingButtonRef = useRef<HTMLButtonElement>(null);
  const [{ hasUserTriedApp }, setHasUserTriedApp] = useCookies([
    "hasUserTriedApp",
  ]);
  const [{ tryDespiteWrongBrowser }, setTryDespiteWrongBrowser] = useCookies([
    "tryDespiteWrongBrowser",
  ]);
  const [isWrongBrowser] = useState(() => {
    const name = browser?.name;
    const os = browser?.os;
    const versionNumber = parseInt(browser?.version ?? "0", 10);
    if (
      initialIsWrongBrowser ||
      !(
        (name === "firefox" && versionNumber >= 44) ||
        (name === "edge-chromium" && versionNumber >= 44) ||
        (name === "chrome" && versionNumber >= 45) ||
        (name === "safari" && versionNumber >= 14)
      ) ||
      os === "BlackBerry OS" ||
      os === "Windows Mobile" ||
      os === "Windows 3.11" ||
      os === "Windows 95" ||
      os === "Windows 98" ||
      os === "Windows 2000" ||
      os === "Windows ME"
    ) {
      return true;
    }
    return false;
  });

  // State variables

  // By default (including during SSR) we consider the service worker to be ready
  // since this is the nominal case that happen all the time except during the very first visit
  const [isServiceWorkerActive, setIsServiceWorkerActive] = useState(
    initialIsServiceWorkerActive || hasUserTriedApp === "true"
  );

  // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Welcome-wizard
  // This param can have several values:
  //   - undefined: Normal behavior, only show the welcome modal when needed
  //   - "open": Force the welcome modal to open even if not needed
  //   - "closed": Don't ever open the welcome modal
  const [paramModalWelcome, setParamModalWelcome] =
    useQueryParam<WelcomeModalParam>(
      "modal-welcome",
      StringParam as QueryParamConfig<WelcomeModalParam, WelcomeModalParam>
    );

  const [isLoadingWorkerAndDemo, setIsLoadingWorkerAndDemo] = useState(
    initialIsLoadingWorkerAndDemo
  );

  // State Transitions

  // wrong-browser => undefined
  const pretendIsCompatibleBrowser = useCallback(() => {
    setTryDespiteWrongBrowser("tryDespiteWrongBrowser", "true", {
      path: "/",
      httpOnly: false,
    });
  }, []);

  // undefined => loading => welcome
  useEffect(() => {
    if (
      router.isReady &&
      ((!(isWrongBrowser && tryDespiteWrongBrowser !== "true") &&
        !isServiceWorkerActive &&
        paramModalWelcome !== "closed") ||
        paramModalWelcome === "open")
    ) {
      performWelcomeWorkflow({
        isServiceWorkerActive,
        setIsServiceWorkerActive,
        client,
        setParamModalWelcome,
        setIsLoadingWorkerAndDemo,
        setHasUserTriedApp,
        handleError,
      });
    }
  }, [tryDespiteWrongBrowser, router.isReady]);

  // welcome => undefined
  const handleGetStarted = useCallback(() => {
    console.log("handleGetStarted1");
    setParamModalWelcome(undefined, "replaceIn");
    console.log("handleGetStarted2");
    router.push("/local/datasets/demo-dataset");
  }, []);

  // welcome => undefined
  const handleSkip = useCallback(() => {
    console.log("handleSkip1");
    setParamModalWelcome(undefined, "replaceIn");
    console.log("handleSkip2");
    router.push("/local/datasets");
  }, []);

  const shouldShowWrongBrowserModal =
    isWrongBrowser &&
    tryDespiteWrongBrowser !== "true" &&
    hasUserTriedApp !== "true";

  const shouldShowLoadingModal =
    hasUserTriedApp !== "true" && isLoadingWorkerAndDemo;

  const shouldShowWelcomeModal =
    hasUserTriedApp !== "true" && !isLoadingWorkerAndDemo;

  console.log({
    isWrongBrowser,
    tryDespiteWrongBrowser,
    hasUserTriedApp,
    shouldShowWrongBrowserModal,
    shouldShowLoadingModal,
    shouldShowWelcomeModal,
  });

  return (
    <Modal
      isOpen={
        shouldShowWrongBrowserModal ||
        (!shouldShowWrongBrowserModal && shouldShowLoadingModal) ||
        (!shouldShowWrongBrowserModal &&
          !shouldShowLoadingModal &&
          shouldShowWelcomeModal)
      }
      onClose={() => {}}
      size="3xl"
      scrollBehavior="inside"
      isCentered
      initialFocusRef={startLabellingButtonRef}
    >
      <ModalOverlay />
      {(() => {
        if (shouldShowWrongBrowserModal) {
          return (
            <WrongBrowser
              startLabellingButtonRef={startLabellingButtonRef}
              onClickTryAnyway={pretendIsCompatibleBrowser}
            />
          );
        }

        if (shouldShowLoadingModal) {
          return <Loading startLabellingButtonRef={startLabellingButtonRef} />;
        }

        if (shouldShowWelcomeModal) {
          return (
            <Welcome
              startLabellingButtonRef={startLabellingButtonRef}
              onClickSkip={handleSkip}
              onClickNext={handleGetStarted}
            />
          );
        }

        return null;
      })()}
    </Modal>
  );
};
