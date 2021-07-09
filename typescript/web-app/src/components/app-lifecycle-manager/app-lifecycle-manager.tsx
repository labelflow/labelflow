import React, { useEffect, useState, useCallback } from "react";
import { useErrorHandler } from "react-error-boundary";
import type { Workbox } from "workbox-window";
import { useQueryParam, StringParam } from "use-query-params";
import { UpdateServiceWorkerModal } from "./update-service-worker-modal/update-service-worker-modal";
import { WelcomeModal } from "./welcome-modal";

declare global {
  interface Window {
    workbox: Workbox;
  }
}

type Props = { assumeServiceWorkerActive: boolean };

// See https://advancedweb.hu/how-to-add-timeout-to-a-promise-in-javascript/
const timeout = <X,>(prom: Promise<X>, time: number): Promise<X> =>
  Promise.race([prom, new Promise<X>((_r, rej) => setTimeout(rej, time))]);

export const AppLifecycleManager = ({ assumeServiceWorkerActive }: Props) => {
  // See https://docs.cypress.io/guides/core-concepts/conditional-testing#Welcome-wizard
  // This param can have several values:
  //   - undefined: Normal behavior, only show the update modal when needed
  //   - "open": Force the update modal to open even if not needed
  //   - "cancel": Don't update the service worker, Don't ever open the update modal
  //   - "update": Do update the service worker when needed, Don't ever open the update modal
  const [paramModalUpdateServiceWorker, setParamModalUpdateServiceWorker] =
    useQueryParam("modal-update-service-worker", StringParam);

  // By default (including during SSR) we consider the service worker to be ready
  // since this is the nominal case that happen all the time except during the very first visit
  const [isServiceWorkerActive, setIsServiceWorkerActive] = useState(
    assumeServiceWorkerActive
  );

  const handleError = useErrorHandler();

  const [isUpdateServiceWorkerModalOpen, setIsUpdateServiceWorkerModalOpen] =
    useState(paramModalUpdateServiceWorker === "open");

  const closeUpdateServiceWorkerModal = useCallback(() => {
    setParamModalUpdateServiceWorker(undefined, "replaceIn");
    setIsUpdateServiceWorkerModalOpen(false);
  }, [setIsUpdateServiceWorkerModalOpen, setParamModalUpdateServiceWorker]);

  const updateServiceWorker = useCallback(() => {
    if (typeof window === "undefined") {
      setParamModalUpdateServiceWorker(undefined, "replaceIn");
      setIsUpdateServiceWorkerModalOpen(false);
      return;
    }
    try {
      const wb = window.workbox;

      if (!wb) {
        throw new Error(
          "Workbox is unavailable, are you on firefox in incognito mode?"
        );
      }

      wb.addEventListener("controlling", (/* event: any */) => {
        window.location.reload();
      });

      // Send a message to the waiting service worker, instructing it to activate.
      wb.messageSkipWaiting();

      setParamModalUpdateServiceWorker(undefined, "replaceIn");
      setIsUpdateServiceWorkerModalOpen(false);
    } catch (e) {
      handleError(e);
    }
  }, [setIsUpdateServiceWorkerModalOpen, setParamModalUpdateServiceWorker]);

  // This hook only run once in browser after the component is rendered for the first time.
  // It has same effect as the old componentDidMount lifecycle callback.
  // See https://github.com/shadowwalker/next-pwa/blob/master/examples/lifecycle/pages/index.js
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    try {
      const wb = window.workbox;

      if (!wb) {
        throw new Error(
          "Workbox is unavailable, are you on firefox in incognito mode?"
        );
      }

      const setServiceWorkerIsActive = () => {
        wb.removeEventListener("activated", setServiceWorkerIsActive);
        wb.removeEventListener("controlling", setServiceWorkerIsActive);
        setIsServiceWorkerActive(true);
      };

      const checkServiceWorkerStatus = async (): Promise<void> => {
        try {
          if (!wb) {
            throw new Error(
              "Workbox is unavailable, are you on firefox in incognito mode?"
            );
          }

          const sw = await timeout(wb.getSW(), 10000);

          // Special case for potential rare case where the service worker
          // stays stuck in the "activating" state. (Seen on Safari sometimes)
          if (sw.state === "activating") {
            await new Promise((_r, rej) => setTimeout(rej, 500));
            if (sw.state === "activating") {
              console.error(
                "Forcing reload because service worker is stuck in activating state"
              );
              window.location.reload();
            }
          }

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
            wb.addEventListener("activated", setServiceWorkerIsActive);
            wb.addEventListener("controlling", setServiceWorkerIsActive);
            return;
          }

          setIsServiceWorkerActive(true);
        } catch (e) {
          console.error(
            "Forcing reload because service worker is unresponsive"
          );
          window.location.reload();
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
          wb.removeEventListener("waiting", promptNewVersionAvailable);
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

      // eslint-disable-next-line consistent-return
      return () => {
        wb.removeEventListener("waiting", promptNewVersionAvailable);
        wb.removeEventListener("activated", setServiceWorkerIsActive);
        wb.removeEventListener("controlling", setServiceWorkerIsActive);
      };
    } catch (e) {
      handleError(e);
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
