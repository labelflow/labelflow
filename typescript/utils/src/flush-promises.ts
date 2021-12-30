/**
 * Flushes the Promises currently running in the PromiseJobs queue
 * Inspired from https://github.com/facebook/jest/issues/2157#issuecomment-279171856
 */
export const flushPromises = (): Promise<void> => {
  return new Promise((resolve) => setImmediate(resolve));
};
