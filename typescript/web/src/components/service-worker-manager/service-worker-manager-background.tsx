import { useEffect } from "react";

export const ServiceWorkerManagerBackground = () => {
  // This hook only run once in browser after the component is rendered for the first time.
  // It registers the service worker and reload the page if the service worker is updated.
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    // Don't show any modals but register and update service worker automatically
    // Good for website pages
    try {
      const wb = window.workbox;

      if (!wb) {
        return;
      }

      const updateServiceWorkerWhenWaiting = () => {
        try {
          wb.removeEventListener("waiting", updateServiceWorkerWhenWaiting);
          wb.addEventListener("controlling", (/* event: any */) => {
            window.location.reload();
          });
          // Send a message to the waiting service worker, instructing it to activate.
          wb.messageSkipWaiting();
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      };

      wb.addEventListener("waiting", updateServiceWorkerWhenWaiting);

      // never forget to call register as auto register is turned off in next.config.js
      wb.register();

      // eslint-disable-next-line consistent-return
      return () => {
        wb.removeEventListener("waiting", updateServiceWorkerWhenWaiting);
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn("This browser does not support service worker");
    }
  }, []);

  return null;
};
