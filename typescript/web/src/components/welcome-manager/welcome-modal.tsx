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
import { useRouter, NextRouter } from "next/router";
import { useErrorHandler } from "react-error-boundary";
import { browser } from "../../utils/detect-scope";
import { BrowserWarning } from "./steps/browser-warning";
import { BrowserError } from "./steps/browser-error";
import { Welcome } from "./steps/welcome";
import { Loading } from "./steps/loading";

const tutorialDatasetFirstImageUrl =
  "/local/datasets/tutorial-dataset/images/2bbbf664-5810-4760-a10f-841de2f35510";

type WelcomeModalParam =
  | undefined // Default: Stays close if user already onboarded, else open asap
  | "open" // Force it to open asap
  | "closed"; // Force it to be closed and never open

export const getDatasetsQuery = gql`
  query getDatasets($where: DatasetWhereInput) {
    datasets(where: $where) {
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
  router,
  client,
  setParamModalWelcome,
  setBrowserError,
}: {
  router: NextRouter;
  setParamModalWelcome: (
    state: WelcomeModalParam,
    updateType: "replaceIn"
  ) => void;
  setBrowserError: (state: Error) => void;
  client: ApolloClient<{}>;
}) => {
  try {
    setParamModalWelcome(undefined, "replaceIn");

    const { data: getDatasetsResult } = await client.query({
      query: getDatasetsQuery,
      variables: { where: { workspaceSlug: "local" } },
    });

    const demoDataset =
      getDatasetsResult?.datasets == null
        ? undefined
        : getDatasetsResult?.datasets.filter(
            (dataset: DatasetType) => dataset.name === "Tutorial dataset"
          )?.[0] ?? undefined;

    if (!demoDataset) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data: createDemoDatasetResult, errors: createDemoDatasetErrors } =
        await client.mutate({
          mutation: createDemoDatasetQuery,
          refetchQueries: [
            "getDatasetData",
            "getDatasetName",
            "getDatasets",
            "getDatasetById",
            "getAllImagesOfADataset",
            "getDataset",
            "countLabelsOfDataset",
            "getLabelClassesOfDataset",
            "image",
            "getImageLabels",
          ],
        });
      if (createDemoDatasetErrors) {
        throw createDemoDatasetErrors[0];
      }
    }

    await router.prefetch(tutorialDatasetFirstImageUrl);
  } catch (error: any) {
    setBrowserError(error);
  }
};

export const WelcomeModal = ({
  initialBrowserWarning = false,
  initialBrowserError = undefined,
  autoStartCountDown = true,
}: {
  initialBrowserWarning?: boolean;
  initialBrowserError?: Error;
  autoStartCountDown?: boolean;
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

  // set cookie based on query param
  useEffect(() => {
    if (paramModalWelcome === "open" && hasUserTriedApp === "true") {
      setHasUserTriedApp("hasUserTriedApp", "false", {
        path: "/",
        httpOnly: false,
      });
    }
    if (paramModalWelcome === "closed" && hasUserTriedApp !== "true") {
      setHasUserTriedApp("hasUserTriedApp", "true", {
        path: "/",
        httpOnly: false,
      });
    }
  }, [paramModalWelcome, hasUserTriedApp]);

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
      !process.env.STORYBOOK &&
      router?.isReady &&
      router?.query?.workspaceSlug === "local" &&
      ((!(browserWarning && tryDespiteBrowserWarning !== "true") &&
        paramModalWelcome !== "closed") ||
        paramModalWelcome === "open")
    ) {
      performWelcomeWorkflow({
        router,
        setBrowserError,
        setParamModalWelcome,
        client,
      });
    }
  }, [tryDespiteBrowserWarning, router?.isReady, router?.query?.workspaceSlug]);

  // welcome => undefined
  const handleGetStarted = useCallback(() => {
    setHasUserTriedApp("hasUserTriedApp", "true", {
      path: "/",
      httpOnly: false,
    });

    setParamModalWelcome(undefined, "replaceIn");

    // First image of tutorial dataset
    router.push(tutorialDatasetFirstImageUrl);
  }, []);

  // welcome => undefined
  const handleSkip = useCallback(() => {
    setHasUserTriedApp("hasUserTriedApp", "true", {
      path: "/",
      httpOnly: false,
    });

    setParamModalWelcome(undefined, "replaceIn");
  }, []);

  const shouldShowBrowserErrorModal = browserWarning && browserError != null;

  const shouldShowBrowserWarningModal =
    router?.isReady &&
    browserError == null &&
    browserWarning &&
    tryDespiteBrowserWarning !== "true" &&
    hasUserTriedApp !== "true";

  const shouldShowLoadingModal = router?.isReady && hasUserTriedApp !== "true";

  const shouldShowWelcomeModal =
    router?.isReady &&
    (paramModalWelcome === "open" ||
      (paramModalWelcome !== "closed" && hasUserTriedApp !== "true"));

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
            <Welcome
              onClickSkip={handleSkip}
              onClickNext={handleGetStarted}
              autoStartCountDown={autoStartCountDown}
            />
          );
        }

        return null;
      })()}
    </Modal>
  );
};
