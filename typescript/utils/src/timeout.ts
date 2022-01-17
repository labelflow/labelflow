/**
 * Executes the specified promise until a given timeout has elapsed
 * @remarks {@link https://advancedweb.hu/how-to-add-timeout-to-a-promise-in-javascript/}
 * @param promise - The promise to execute
 * @param ms - Maximum time to wait for the promise to complete (in milliseconds)
 * @param reason - Optional error to throw if the timeout has elapsed
 * @returns Promise return value if any
 */
export const timeout = <TReturn>(
  promise: Promise<TReturn>,
  ms: number,
  reason: unknown = "Timeout"
): Promise<TReturn> => {
  const rejectOnTimeout = new Promise<TReturn>((_, reject) =>
    setTimeout(() => reject(reason), ms)
  );
  return Promise.race([promise, rejectOnTimeout]);
};
