import React, { useEffect, useState, useCallback } from "react";
import type { Workbox } from "workbox-window";
import { UpdateServiceWorkerModal } from "./update-service-worker-modal/update-service-worker-modal";
import { WelcomeModal } from "./welcome-modal";

declare global {
  interface Window {
    workbox: Workbox;
  }
}

export const AppLifecycleManager = () => {
  // By default (including during SSR) we consider the service worker to be ready
  // since this is the nominal case that happen all the time except during the very first visi
  const [isServiceWorkerActive, setIsServiceWorkerActive] = useState(true);

  const [isUpdateServiceWorkerModalOpen, setIsUpdateServiceWorkerModalOpen] =
    useState(false);

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
        if (sw.state !== "activated") {
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
        setIsUpdateServiceWorkerModalOpen(true);
      };

      wb.addEventListener("waiting", promptNewVersionAvailable);

      // never forget to call register as auto register is turned off in next.config.js
      wb.register();
    }
  }, []);

  const closeUpdateServiceWorkerModal = useCallback(() => {
    setIsUpdateServiceWorkerModalOpen(false);
  }, [setIsUpdateServiceWorkerModalOpen]);

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

    setIsUpdateServiceWorkerModalOpen(false);
  }, [setIsUpdateServiceWorkerModalOpen]);

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
