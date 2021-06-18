import React, { useEffect, useState, useCallback } from "react";
import type { Workbox } from "workbox-window";
import { useQueryParam, StringParam } from "use-query-params";
import { UpdateServiceWorkerModal } from "./update-service-worker-modal/update-service-worker-modal";
import { WelcomeModal } from "./welcome-modal";

declare global {
  interface Window {
    workbox: Workbox;
  }
}

export const AppLifecycleManager = () => {
  // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Welcome-wizard
  // This param can have several values:
  //   - undefined: Normal behavior, only show the update modal when needed
  //   - "open": Force the update modal to open even if not needed
  //   - "cancel": Don't update the service worker, Don't ever open the update modal
  //   - "update": Do update the service worker when needed, Don't ever open the update modal
  const [paramModalUpdateServiceWorker, setParamModalUpdateServiceWorker] =
    useQueryParam("modal-update-service-worker", StringParam);

  // By default (including during SSR) we consider the service worker to be ready
  // since this is the nominal case that happen all the time except during the very first visi
  const [isServiceWorkerActive, setIsServiceWorkerActive] = useState(true);

  const [isUpdateServiceWorkerModalOpen, setIsUpdateServiceWorkerModalOpen] =
    useState(false);

  const closeUpdateServiceWorkerModal = useCallback(() => {
    setParamModalUpdateServiceWorker(undefined, "replaceIn");
    setIsUpdateServiceWorkerModalOpen(false);
  }, [setIsUpdateServiceWorkerModalOpen, setParamModalUpdateServiceWorker]);

  const updateServiceWorker = useCallback(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      window.workbox !== undefined
    ) {
      const wb = window.workbox;
      wb.addEventListener("controlling", (/* event: any */) => {
        window.location.reload();
      });

      // Send a message to the waiting service worker, instructing it to activate.
      wb.messageSkipWaiting();
    }
    setParamModalUpdateServiceWorker(undefined, "replaceIn");
    setIsUpdateServiceWorkerModalOpen(false);
  }, [setIsUpdateServiceWorkerModalOpen, setParamModalUpdateServiceWorker]);

  // This hook only run once in browser after the component is rendered for the first time.
  // It has same effect as the old componentDidMount lifecycle callback.
  // See https://github.com/shadowwalker/next-pwa/blob/master/examples/lifecycle/pages/index.js
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      window.workbox !== undefined
    ) {
      const wb = window.workbox;

      const checkServiceWorkerStatus = async () => {
        const sw = await wb.getSW();
        if (
          !(
            (
              sw.state === "activated" || // Nominal case, service worker already installed and running, no new service worker waiting
              sw.state === "installed"
            )
            // Service worker already installed and running, but there is a new service worker waiting
          )
        ) {
          setIsServiceWorkerActive(false);
          wb.addEventListener("activated", () => {
            setIsServiceWorkerActive(true);
          });
        }
      };

      checkServiceWorkerStatus();

      // add event listeners to handle any of PWA lifecycle event
      // https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-window.Workbox#events
      wb.addEventListener("redundant", () => {
        window.location.reload();
      });

      // A common UX pattern for progressive web apps is to show a banner when a service worker has updated and waiting to install.
      // NOTE: MUST set skipWaiting to false in next.config.js pwa object
      // https://developers.google.com/web/tools/workbox/guides/advanced-recipes#offer_a_page_reload_for_users
      const promptNewVersionAvailable = (/* event: any */) => {
        if (paramModalUpdateServiceWorker === "cancel") {
          return;
        }
        if (paramModalUpdateServiceWorker === "update") {
          updateServiceWorker();
          return;
        }
        setIsUpdateServiceWorkerModalOpen(true);
      };

      if (paramModalUpdateServiceWorker === "open") {
        promptNewVersionAvailable();
      } else {
        wb.addEventListener("waiting", promptNewVersionAvailable);
      }

      // never forget to call register as auto register is turned off in next.config.js
      wb.register();
    }
  }, []);

  return (
    <>
      <WelcomeModal isServiceWorkerActive={isServiceWorkerActive} />
      <UpdateServiceWorkerModal
        isOpen={isUpdateServiceWorkerModalOpen}
        onClose={closeUpdateServiceWorkerModal}
        onConfirm={updateServiceWorker}
      />
    </>
  );
};
