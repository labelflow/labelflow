/**
 * An higher order function which takes an error message and a function.
 * Returns the given function, but the function wil throw the given error
 * message if the original function would return `null` or `undefined` when called.
 *
 * @param errorMessage The error message to throw.
 * @param functionToWrap The function to wrap, it can be async.
 * @returns An async function which wraps the `functionToWrap`. This new function
 * will throw if `functionToWrap` was to return `null` or `undefined`.
 */
export const throwIfResolvesToNil =
  <Inputs extends Array<any>, Outputs extends any>(
    errorMessage: string,
    functionToWrap: (...args: Inputs) => Promise<Outputs> | Outputs
  ) =>
  async (...args: Inputs): Promise<NonNullable<Outputs>> => {
    const result = await functionToWrap(...args);
    if (result == null) {
      throw new Error(errorMessage);
    }
    return result as NonNullable<Outputs>;
  };
