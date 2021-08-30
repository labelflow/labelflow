import {
  // useRef,
  useEffect,
  useCallback,
  useState,
} from "react";
import { ApolloClient, gql, useApolloClient } from "@apollo/client";
import { useCookies } from "react-cookie";
import { Modal, ModalOverlay } from "@chakra-ui/react";

import { QueryParamConfig, StringParam, useQueryParam } from "use-query-params";
import type { Dataset as DatasetType } from "@labelflow/graphql-types";
import { useRouter } from "next/router";
import { useErrorHandler } from "react-error-boundary";
import { browser } from "../../../utils/detect-scope";
import { BrowserWarning } from "./steps/browser-warning";
import { BrowserError } from "./steps/browser-error";
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
  setBrowserError,
}: // setHasUserTriedApp,
// handleError,
{
  isServiceWorkerActive: boolean;
  setIsServiceWorkerActive: (state: boolean) => void;
  setParamModalWelcome: (
    state: WelcomeModalParam,
    updateType: "replaceIn"
  ) => void;
  setBrowserError: (state: Error) => void;
  setIsLoadingWorkerAndDemo: (state: boolean) => void;
  client: ApolloClient<{}>;
  // setHasUserTriedApp: any;
  // handleError: (error: Error) => void;
}) => {
  try {
    if (isServiceWorkerActive) {
      return;
    }

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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data: createDemoDatasetResult, errors: createDemoDatasetErrors } =
        await client.mutate({
          mutation: createDemoDatasetQuery,
          refetchQueries: ["getDatasets"],
        });
      if (createDemoDatasetErrors) {
        throw createDemoDatasetErrors[0];
      }
    }

    setIsLoadingWorkerAndDemo(false);
  } catch (error) {
    setBrowserError(error);
  }
};

export const WelcomeModal = ({
  initialIsServiceWorkerActive = false,
  initialBrowserWarning = false,
  initialIsLoadingWorkerAndDemo = false,
  initialBrowserError = undefined,
}: {
  initialIsServiceWorkerActive?: boolean;
  initialBrowserWarning?: boolean;
  initialIsLoadingWorkerAndDemo?: boolean;
  initialBrowserError?: Error;
}) => {
  const router = useRouter();
  const handleError = useErrorHandler();
  const client = useApolloClient();

  const [{ hasUserTriedApp }, setHasUserTriedApp] = useCookies([
    "hasUserTriedApp",
  ]);
  const [{ tryDespiteBrowserWarning }, setTryDespiteBrowserWarning] =
    useCookies(["tryDespiteBrowserWarning"]);

  const [browserWarning] = useState(() => {
    const name = browser?.name;
    const os = browser?.os;
    const versionNumber = parseInt(browser?.version ?? "0", 10);
    if (
      initialBrowserWarning ||
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

  const [browserError, setBrowserError] = useState(initialBrowserError);

  // State Transitions

  // wrong-browser => undefined
  const pretendIsCompatibleBrowser = useCallback(() => {
    setTryDespiteBrowserWarning("tryDespiteBrowserWarning", "true", {
      path: "/",
      httpOnly: false,
    });
  }, []);

  // undefined => loading => welcome
  useEffect(() => {
    if (
      router?.isReady &&
      ((!(browserWarning && tryDespiteBrowserWarning !== "true") &&
        !isServiceWorkerActive &&
        paramModalWelcome !== "closed") ||
        paramModalWelcome === "open")
    ) {
      performWelcomeWorkflow({
        setBrowserError,
        isServiceWorkerActive,
        setIsServiceWorkerActive,
        client,
        setParamModalWelcome,
        setIsLoadingWorkerAndDemo,
        // setHasUserTriedApp,
        // handleError,
      });
    }
  }, [tryDespiteBrowserWarning, router?.isReady]);

  // welcome => undefined
  const handleGetStarted = useCallback(() => {
    setHasUserTriedApp("hasUserTriedApp", "true", {
      path: "/",
      httpOnly: false,
    });

    setParamModalWelcome(undefined, "replaceIn");

    router.push(
      "/local/datasets/tutorial-dataset/images/2bbbf664-5810-4760-a10f-841de2f35510"
    );
  }, []);

  // welcome => undefined
  const handleSkip = useCallback(() => {
    setHasUserTriedApp("hasUserTriedApp", "true", {
      path: "/",
      httpOnly: false,
    });

    setParamModalWelcome(undefined, "replaceIn");

    router.push("/local/datasets");
  }, []);

  const shouldShowBrowserErrorModal = browserWarning && browserError != null;

  const shouldShowBrowserWarningModal =
    browserError == null &&
    browserWarning &&
    tryDespiteBrowserWarning !== "true" &&
    hasUserTriedApp !== "true";

  const shouldShowLoadingModal =
    hasUserTriedApp !== "true" && isLoadingWorkerAndDemo;

  const shouldShowWelcomeModal =
    hasUserTriedApp !== "true" && !isLoadingWorkerAndDemo;

  return (
    <Modal
      isOpen={
        shouldShowBrowserErrorModal ||
        (!shouldShowBrowserErrorModal && shouldShowBrowserWarningModal) ||
        (!shouldShowBrowserErrorModal &&
          !shouldShowBrowserWarningModal &&
          shouldShowLoadingModal) ||
        (!shouldShowBrowserErrorModal &&
          !shouldShowBrowserWarningModal &&
          !shouldShowLoadingModal &&
          shouldShowWelcomeModal)
      }
      onClose={() => {}}
      size="3xl"
      scrollBehavior="inside"
      isCentered
    >
      <ModalOverlay />
      {(() => {
        // If there was an error AND the browser is wrong, we show the browser error modal
        if (shouldShowBrowserErrorModal) {
          return <BrowserError error={browserError} />;
        }

        // If there was an error, we handle it the normal way, showing the normal error screen
        if (browserError) {
          handleError(browserError);
        }

        // If there was no error AND the browser is wrong, we still show the browser warning modal
        if (shouldShowBrowserWarningModal) {
          return (
            <BrowserWarning onClickTryAnyway={pretendIsCompatibleBrowser} />
          );
        }

        // Nominal loading on first visit
        if (shouldShowLoadingModal) {
          return <Loading />;
        }

        // Nominal welcome modal on first vist after loading
        if (shouldShowWelcomeModal) {
          return (
            <Welcome onClickSkip={handleSkip} onClickNext={handleGetStarted} />
          );
        }

        return null;
      })()}
    </Modal>
  );
};
