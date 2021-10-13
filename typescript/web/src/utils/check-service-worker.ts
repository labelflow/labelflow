// import { Workbox } from "workbox-window";
// import { WorkboxEventMap } from "workbox-window/utils/WorkboxEvent";
// import { timeout } from "./timeout";

// export const messageNoWindow =
//   "Not in window scope, service worker does not exist";
// export const messageNoWorkbox =
//   "Workbox is unavailable, are you on Firefox in incognito mode?";
// export const messageTimeoutGettingSw =
//   "Timeout when getting workbox service worker, are you running tests on Cypress?";
// export const messageSwStuck =
//   "Service worker is stuck in activating state, are you on Safari with a slow computer?";
// export const messageSwActivateTimeout =
//   "Service worker timed out and never activated";

// function waitForEvent(
//   wb: Workbox,
//   event: keyof WorkboxEventMap
// ): Promise<void> {
//   return new Promise<void>((resolve) => {
//     const listenerFunction = () => {
//       wb.removeEventListener(event, listenerFunction);
//       resolve();
//     };
//     wb.addEventListener(event, listenerFunction);
//   });
// }

// export const checkServiceWorkerRedundant = async ({ wb }: { wb: Workbox }) => {
//   await waitForEvent(wb, "redundant");
// };

// /**
//  * This function robustly check the service worker state and only returns when it is active and working.
//  * Otherwise it throws various errors, see in the code.
//  * @param maxTries max number of tries
//  * @param retries number of retries made already
//  * @returns
//  */
// export const checkServiceWorkerReady = async (
//   maxTries = 2,
//   retries = 0
// ): Promise<{ wb: Workbox; sw: ServiceWorker }> => {
//   try {
//     // Get the workbox instance from the window
//     if (typeof window === "undefined") {
//       throw new Error(messageNoWindow);
//     }

//     // Get the workbox instance from the window
//     const wb = window.workbox;
//     if (!wb) {
//       throw new Error(messageNoWorkbox);
//     }

//     // Get the service worker from workbox
//     const sw = await timeout(
//       wb.getSW(),
//       20000,
//       new Error(messageTimeoutGettingSw)
//     );

//     // Special case for potential rare case where the service worker
//     // stays stuck in the "activating" state. (Seen on Safari sometimes)
//     if (sw.state === "activating") {
//       await timeout(
//         waitForEvent(wb, "activated"),
//         1000,
//         new Error(messageSwStuck)
//       );
//     }

//     // Service worker not in active state, need to wait for it
//     // Nominal case, service worker already installed and running, no new service worker waiting
//     // Service worker already installed and running, but there is a new service worker waiting
//     if (sw.state !== "activated") {
//       await timeout(
//         waitForEvent(wb, "activated"),
//         10000,
//         new Error(messageSwActivateTimeout)
//       );
//     }

//     return { wb, sw };
//   } catch (error) {
//     // If we are not in window scope, this is not going to change by retrying
//     if (error.message === messageNoWindow) {
//       throw error;
//     }
//     // console.error(
//     //   `Error while checking service worker. ${maxTries - retries} retries left`,
//     //   error
//     // );
//     if (retries < maxTries) {
//       return await checkServiceWorkerReady(maxTries, retries + 1);
//     }
//     throw error;
//   }
// };
