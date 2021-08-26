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
import { LoadingFinished } from "./steps/loading-finished";
import { Welcome } from "./steps/welcome";
import { LoadingWorker } from "./steps/loading-worker";
import { LoadingDemo } from "./steps/loading-demo";
import {
  checkServiceWorkerReady,
  messageNoWindow,
} from "../../../utils/check-service-worker";

type WelcomeModalParam =
  | undefined // Default: Stays close if user already onboarded, else open asap
  | "open" // Force it to open asap
  | "closed"; // Force it to be closed and never open

type WelcomeWorkflowState =
  | undefined
  | "loading-worker" // Loading worker
  | "loading-demo" // Loading demo data
  | "loading-finished"; // Finished loading everything

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

// type HasUserTriedApp = "hasUserTriedApp";

const performWelcomeWorkflow = async ({
  client,
  setParamModalWelcome,
  setWelcomeWorkflowState,

  setCookie,
  handleError,
}: {
  setParamModalWelcome: (
    state: WelcomeModalParam,
    updateType: "replaceIn"
  ) => void;
  setWelcomeWorkflowState: (state: WelcomeWorkflowState) => void;

  client: ApolloClient<{}>;
  setCookie: any;
  handleError: (error: Error) => void;
}) => {
  try {
    setParamModalWelcome(undefined, "replaceIn");
    setWelcomeWorkflowState("loading-worker");

    await checkServiceWorkerReady();

    setWelcomeWorkflowState("loading-demo");

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

    setCookie("hasUserTriedApp", "true", { path: "/", httpOnly: false });
    setWelcomeWorkflowState("loading-finished");
  } catch (error) {
    handleError(error);
  }
};

export const WelcomeModal = ({
  initialIsServiceWorkerActive = false,
  initialHasUserClickedStart = false,
  initialIsWrongBrowser = false,
  initialWelcomeWorkflowState = undefined,
}: {
  initialIsServiceWorkerActive?: boolean;
  initialHasUserClickedStart?: boolean;
  initialIsWrongBrowser?: boolean;
  initialWelcomeWorkflowState?: WelcomeWorkflowState;
}) => {
  const router = useRouter();
  const handleError = useErrorHandler();
  const client = useApolloClient();
  const startLabellingButtonRef = useRef<HTMLButtonElement>(null);
  const [{ hasUserTriedApp }, setCookie] = useCookies(["hasUserTriedApp"]);

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

  const [hasUserClickedStart, setHasUserClickedStart] = useState(
    initialHasUserClickedStart
  );

  const [welcomeWorkflowState, setWelcomeWorkflowState] =
    useState<WelcomeWorkflowState>(initialWelcomeWorkflowState);

  const [isWrongBrowser, setIsWrongBrowser] = useState(() => {
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

  // State Transitions

  // This hook only run once in browser after the component is rendered for the first time.
  // It has same effect as the old componentDidMount lifecycle callback.
  // See https://github.com/shadowwalker/next-pwa/blob/master/examples/lifecycle/pages/index.js
  useEffect(() => {
    const checkServiceWorkerStatus = async (): Promise<void> => {
      try {
        await checkServiceWorkerReady();
        setIsServiceWorkerActive(true);
      } catch (error) {
        if (error.message === messageNoWindow) {
          return;
        }
        setIsServiceWorkerActive(false);
        handleError(error);
      }
    };
    checkServiceWorkerStatus();
  }, []);

  // wrong-browser => undefined
  const pretendIsCompatibleBrowser = useCallback(() => {
    setIsWrongBrowser(false);
  }, []);

  // undefined => welcome
  useEffect(() => {
    if (
      (!isWrongBrowser &&
        !isServiceWorkerActive &&
        paramModalWelcome !== "closed") ||
      paramModalWelcome === "open"
    ) {
      performWelcomeWorkflow({
        client,
        setParamModalWelcome,
        setWelcomeWorkflowState,
        setCookie,
        handleError,
      });
    }
  }, [isWrongBrowser]);

  // welcome => loading-worker
  const handleClickStart = useCallback(() => {
    setHasUserClickedStart(true);
  }, []);

  // loading-finished => undefined
  const handleGetStarted = useCallback(() => {
    setParamModalWelcome(undefined, "replaceIn");
    router.push("/local/datasets/demo-dataset");
  }, []);

  // loading-finished => undefined
  const handleSkip = useCallback(() => {
    setParamModalWelcome(undefined, "replaceIn");
    router.push("/local/datasets");
  }, []);

  return (
    <Modal
      isOpen={
        (paramModalWelcome && paramModalWelcome !== "closed") ||
        hasUserTriedApp !== "true"
      }
      onClose={() => {}}
      size="3xl"
      scrollBehavior="inside"
      isCentered
      initialFocusRef={startLabellingButtonRef}
    >
      <ModalOverlay />
      {(() => {
        if (isWrongBrowser) {
          return (
            <WrongBrowser
              startLabellingButtonRef={startLabellingButtonRef}
              onClickNext={pretendIsCompatibleBrowser}
            />
          );
        }
        if (!hasUserClickedStart) {
          return (
            <Welcome
              startLabellingButtonRef={startLabellingButtonRef}
              hasUserClickedStart={hasUserClickedStart}
              onClickNext={handleClickStart}
            />
          );
        }
        if (welcomeWorkflowState === "loading-worker") {
          return (
            <LoadingWorker startLabellingButtonRef={startLabellingButtonRef} />
          );
        }
        if (welcomeWorkflowState === "loading-demo") {
          return (
            <LoadingDemo startLabellingButtonRef={startLabellingButtonRef} />
          );
        }
        if (welcomeWorkflowState === "loading-finished") {
          return (
            <LoadingFinished
              startLabellingButtonRef={startLabellingButtonRef}
              onClickSkip={handleSkip}
              onClickNext={handleGetStarted}
            />
          );
        }
        throw new Error("Welcome modal is in unknown state");
      })()}
    </Modal>
  );
};
