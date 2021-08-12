import { ApolloLink, FetchResult, Observable } from "@apollo/client";
import {
  checkServiceWorkerReady,
  checkServiceWorkerRedundant,
  messageNoWindow,
} from "../../utils/check-service-worker";
import { Deferred } from "../../utils/deferred";

// Deferred value to know if server is ready
const isServerReady = new Deferred<boolean>();

const manageServerReadiness = async (maxTries = 2) => {
  let retries = 0;
  // eslint-disable-next-line no-constant-condition
  while (retries < maxTries) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const { wb } = await checkServiceWorkerReady();
      isServerReady.resolve(true);
      // eslint-disable-next-line no-await-in-loop
      await checkServiceWorkerRedundant({ wb });
      isServerReady.reset();
    } catch (error) {
      if (error.message === messageNoWindow) {
        isServerReady.resolve(true);
        return;
      }
      isServerReady.reject(error);
      retries += 1;
    }
  }
};

manageServerReadiness();

export const awaitServiceWorkerLink = new ApolloLink((operation, forward) => {
  if (!isServerReady.value) {
    return new Observable<FetchResult>((observer) => {
      const runObservable = async () => {
        try {
          await isServerReady.promise;
          const forwarded = forward(operation);

          forwarded.subscribe({
            next: observer.next.bind(observer),
            complete: observer.complete.bind(observer),
            error: observer.error.bind(observer),
          });
        } catch (error) {
          observer.error.bind(observer)(error);
        }
      };
      runObservable();
    });
  }
  return forward(operation);
});
