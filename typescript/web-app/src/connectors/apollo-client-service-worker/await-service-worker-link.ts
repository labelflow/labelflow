import {
  ApolloLink,
  FetchResult,
  Observable,
  // fromPromise,
  // Operation,
  // NextLink,
} from "@apollo/client";
import { WorkboxMessageEvent } from "workbox-window/utils/WorkboxEvent";

import { windowExists } from "../../utils/window-exists";

// /**
//  * Transform an apollo operation to a promise
//  * This is the opposite of `fromPromise`
//  * See https://github.com/apollographql/apollo-client/blob/main/src/link/utils/fromPromise.ts
//  * @param operation
//  * @param forward
//  * @returns
//  */
// const toPromise = (
//   operation: Operation,
//   forward: NextLink
// ): Promise<FetchResult> =>
//   new Promise((resolve, reject) => {
//     forward(operation).subscribe({
//       next: (...args) => {
//         resolve(...args);
//       },
//       error: reject,
//     });
//   });
// const awaitServiceWorkerLink = new ApolloLink((operation, forward) => {
//   const forwardPromise = async () => {
//     await new Promise((resolve) => setTimeout(resolve, 5000));
//     const fetchResult = await toPromise(operation, forward);
//     return fetchResult;
//   };
//   return fromPromise<FetchResult>(forwardPromise());
// });

// Ways to know that the server is ready
let resolveIsServerReadyPromise: (() => void) | undefined;
let rejectIsServerReadyPromise: ((reason?: any) => void) | undefined;
const isServerReadyPromise = new Promise<void>((resolve, reject) => {
  resolveIsServerReadyPromise = resolve;
  rejectIsServerReadyPromise = reject;
});
let isServerReady = false;

const waitServerReady = async (callback: (error?: Error) => void) => {
  try {
    await isServerReadyPromise;
    console.log("Service worker is ready to start query");
    callback();
  } catch (error) {
    callback(error);
  }
};

const checkServerReady = () => {
  if (!windowExists) {
    rejectIsServerReadyPromise?.(
      "Not in window scope, service worker does not exist"
    );
    return;
  }
  const wb = window.workbox;

  const listenerFunction = (event: WorkboxMessageEvent) => {
    if (event.data.type === "NOTIFY_SERVER_READY") {
      console.log("Service worker is ready global");

      if (resolveIsServerReadyPromise) {
        resolveIsServerReadyPromise();
      } else {
        console.error(
          "Cannot resolve the resolveIsServerReadyPromise in client, this should not happen"
        );
      }
      isServerReady = true;

      wb.removeEventListener("message", listenerFunction);
    }
  };

  wb.addEventListener("message", listenerFunction);

  wb.messageSW({ type: "CHECK_SERVER_READY" });
};

checkServerReady();

export const awaitServiceWorkerLink = new ApolloLink((operation, forward) => {
  if (!isServerReady) {
    return new Observable<FetchResult>((observer) => {
      waitServerReady((error) => {
        if (error) {
          observer.error.bind(observer)(error);
          return;
        }

        const forwarded = forward(operation);

        forwarded.subscribe({
          next: observer.next.bind(observer),
          complete: observer.complete.bind(observer),
          error: observer.error.bind(observer),
        });
      });
    });
  }
  return forward(operation);
});
