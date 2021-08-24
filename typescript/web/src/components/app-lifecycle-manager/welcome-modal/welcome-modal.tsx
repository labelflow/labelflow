import { useRef, useEffect, useCallback, useState } from "react";
import {
  ApolloCache,
  ApolloClient,
  gql,
  useMutation,
  useQuery,
} from "@apollo/client";
import { useCookie } from "next-cookie";
import { Modal, ModalOverlay } from "@chakra-ui/react";
import { useErrorHandler } from "react-error-boundary";
import { QueryParamConfig, StringParam, useQueryParam } from "use-query-params";
import type { Dataset as DatasetType } from "@labelflow/graphql-types";
import { Router, useRouter } from "next/router";
import { browser } from "../../../utils/detect-scope";
import { WrongBrowser } from "./steps/wrong-browser";
import { LoadingFinished } from "./steps/loading-finished";
import { Welcome } from "./steps/welcome";
import { LoadingWorker } from "./steps/loading-worker";
import { LoadingDemo } from "./steps/loading-demo";
import { checkServiceWorkerReady } from "../../../utils/check-service-worker";

type WelcomeModalParam =
  | undefined // Default: Stays close if user already onboarded, else open asap
  | "open" // Force it to open asap
  | "closed"; // Force it to be closed and never open

type WelcomeModalState =
  | undefined
  | "welcome" // Open and nominal welcome page
  | "loading-worker" // Open and still loading worker after user clicks "start"
  | "loading-demo" // Open and still loading demo data after user clicks "start"
  | "loading-finished"; // Open and finished loading everything

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
  router,
  setParamModalWelcome,
  client,
  handleError,
}: {
  router: Router;
  setParamModalWelcome: () => void;
  client: ApolloClient<ApolloCache<any>>;
  handleError: (error: Error) => void;
}) => {
  const name = browser?.name;
  const os = browser?.os;
  const versionNumber = parseInt(browser?.version ?? "0", 10);
  if (
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
    setParamModalWelcome("wrong-browser", "replaceIn");
    return;
  }

  setParamModalWelcome("loading-worker", "replaceIn");

  try {
    await checkServiceWorkerReady();
  } catch (e) {
    setParamModalWelcome("wrong-browser", "replaceIn");
    return;
  }

  setParamModalWelcome("loading-demo", "replaceIn");

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
    const { data: createDemoDatasetResult } = await client.mutate({
      mutation: createDemoDatasetQuery,
    });
  }

  setParamModalWelcome("loading-finished", "replaceIn");
};

export const WelcomeModal = ({
  isServiceWorkerActive,
  initiallyHasUserClickedStart = false,
  initialIsWrongBrowser = false,
  initialWelcomeModalState = "welcome",
}: {
  isServiceWorkerActive: boolean;
  initiallyHasUserClickedStart?: boolean;
  initialIsWrongBrowser?: boolean;
  initialWelcomeModalState?: WelcomeModalState;
}) => {
  const router = useRouter();

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
    initiallyHasUserClickedStart
  );

  const [isWelcomeModalState, setIsWelcomeModalState] =
    useState<WelcomeModalState>(initialWelcomeModalState);

  const [isWrongBrowser, setIsWrongBrowser] = useState(initialIsWrongBrowser);

  console.log("paramModalWelcome in WelcomeModal ", paramModalWelcome);

  const startLabellingButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isServiceWorkerActive) {
      performWelcomeWorkflow();
    }
  }, []);

  // // Transition open => welcome
  // useEffect(() => {
  //   if (paramModalWelcome === "open") {
  //     setParamModalWelcome("wrong-browser", "replaceIn");
  //   }
  // }, [paramModalWelcome === "open"]);

  // // Transition undefined => welcome
  // useEffect(() => {
  //   if (!isServiceWorkerActive && paramModalWelcome == null) {
  //     setParamModalWelcome("welcome", "replaceIn");
  //   }
  // }, [paramModalWelcome == null, isServiceWorkerActive]);

  // // Transition welcome => loading-worker
  // const handleClickStartLabelling = useCallback(() => {
  //   setHasUserClickedStart(true);

  //   // This is needed to fix a rare bug in which the welcome modal is stuck
  //   // in the "loading app" state when a new service worker is waiting AND
  //   // the welcome modal is open.
  //   // This never happens except in nominal user flows, but still
  //   if (
  //     typeof window !== "undefined" &&
  //     "serviceWorker" in navigator &&
  //     window.workbox !== undefined
  //   ) {
  //     const wb = window.workbox;
  //     // // This next 3 lines were removed because they caused a reload of the page
  //     // // when the user clicked "Start Labelling"
  //     // wb.addEventListener("controlling", (/* event: any */) => {
  //     //   window.location.reload();
  //     // });
  //     // Send a message to the waiting service worker, instructing it to activate.
  //     wb.messageSkipWaiting();
  //   }
  //   setParamModalWelcome("loading-worker", "replaceIn");
  // }, [setHasUserClickedStart]);

  // // Transition loading-worker => loading-demo
  // useEffect(() => {
  //   if (paramModalWelcome === "loading-worker") {
  //     if (isServiceWorkerActive) {
  //       setParamModalWelcome("loading-demo", "replaceIn");
  //     }
  //   }
  // }, [paramModalWelcome === "loading-worker", isServiceWorkerActive]);

  // // const parsedCookie = useCookie(/*cookie*/);
  // // const didVisitDemoDataset = parsedCookie.get("didVisitDemoDataset");
  // // const hasUserTriedApp = parsedCookie.get("hasUserTriedApp");
  // // const hasDatasets =
  // //   datasetsResult?.datasets == null
  // //     ? false
  // //     : datasetsResult?.datasets?.length > 0;

  // // const [createDemoDatasetMutation] = useMutation(createDemoDatasetQuery, {
  // //   update: (cache, { data: { createDemoDataset } }) => {
  // //     cache.writeQuery({
  // //       query: getDatasetsQuery,
  // //       data: {
  // //         datasets: [...(datasetsResult?.datasets ?? []), createDemoDataset],
  // //       },
  // //     });
  // //   },
  // // });

  // // const demoDataset =
  // //   datasetsResult?.datasets == null
  // //     ? undefined
  // //     : datasetsResult?.datasets.filter(
  // //         (dataset) => dataset.name === "Demo dataset"
  // //       )?.[0] ?? undefined;

  // // const handleError = useErrorHandler();

  // // useEffect(() => {
  // //   const createDemoDataset = async () => {
  // //     if (loading === true || hasDatasets) return;
  // //     if (!didVisitDemoDataset && demoDataset == null) {
  // //       try {
  // //         await createDemoDatasetMutation();
  // //       } catch (error) {
  // //         parsedCookie.set("didVisitDemoDataset", true);
  // //         handleError(error);
  // //       }
  // //     }
  // //   };
  // //   createDemoDataset();
  // // }, [
  // //   demoDataset,
  // //   loading,
  // //   didVisitDemoDataset,
  // //   parsedCookie,
  // //   router,
  // //   hasDatasets,
  // // ]);

  // // Transition loading-demo => undefined
  // useEffect(() => {
  //   if (paramModalWelcome === "loading-demo") {
  //     if (isServiceWorkerActive) {
  //       setParamModalWelcome("loading-demo", "replaceIn");
  //     }
  //   }
  // }, [paramModalWelcome === "loading-demo", isServiceWorkerActive]);

  return (
    <Modal
      isOpen={(paramModalWelcome && paramModalWelcome !== "closed") ?? false}
      onClose={() => {}}
      size="3xl"
      scrollBehavior="inside"
      isCentered
      initialFocusRef={startLabellingButtonRef}
    >
      <ModalOverlay />
      {isWrongBrowser ? (
        <WrongBrowser startLabellingButtonRef={startLabellingButtonRef} />
      ) : (
        (isWelcomeModalState === "welcome" && (
          <Welcome
            startLabellingButtonRef={startLabellingButtonRef}
            hasUserClickedStart={hasUserClickedStart}
            onClickNext={() => setHasUserClickedStart(true)}
          />
        )) ||
        (isWelcomeModalState === "loading-worker" && (
          <LoadingWorker startLabellingButtonRef={startLabellingButtonRef} />
        )) ||
        (isWelcomeModalState === "loading-demo" && (
          <LoadingDemo startLabellingButtonRef={startLabellingButtonRef} />
        )) ||
        (isWelcomeModalState === "loading-finished" && (
          <LoadingFinished startLabellingButtonRef={startLabellingButtonRef} />
        ))
      )}
    </Modal>
  );
};
