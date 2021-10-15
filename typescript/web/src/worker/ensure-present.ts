import { Workbox } from "workbox-window";

// To build the service worker, do
// npx spack
export const ensureServiceWorkerPresent = () => {
  if (
    "serviceWorker" in navigator &&
    !("workbox" in window && window.workbox != null)
  ) {
    const wb = new Workbox("/static/sw/index.js");
    window.workbox = wb;
  }
};
