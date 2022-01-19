export type ErrorOverride = (error: unknown) => void;

export const overrideError = (error: unknown, prettifiers: ErrorOverride[]) => {
  prettifiers.forEach((prettify) => prettify(error));
  throw error;
};

export const callWithErrorOverrides = <TParameters extends unknown[], TReturn>(
  fn: (...params: TParameters) => TReturn,
  params: TParameters,
  prettifiers: ErrorOverride[]
): TReturn => {
  try {
    return fn(...params);
  } catch (error) {
    overrideError(error, prettifiers);
    throw error;
  }
};

export const withErrorOverrides = <TParameters extends unknown[], TResult>(
  fn: (...params: TParameters) => TResult,
  prettifiers: ErrorOverride[]
): ((...params: TParameters) => TResult) => {
  return (...args: TParameters) =>
    callWithErrorOverrides<TParameters, TResult>(fn, args, prettifiers);
};

export const callWithErrorOverridesAsync = async <
  TParameters extends unknown[],
  TReturn
>(
  fn: (...params: TParameters) => Promise<TReturn>,
  params: TParameters,
  prettifiers: ErrorOverride[]
): Promise<TReturn> => {
  try {
    return await fn(...params);
  } catch (error) {
    overrideError(error, prettifiers);
    throw error;
  }
};

export const withErrorOverridesAsync = <TParameters extends unknown[], TResult>(
  fn: (...params: TParameters) => Promise<TResult>,
  prettifiers: ErrorOverride[]
): ((...params: TParameters) => Promise<TResult>) => {
  return (...args: TParameters) =>
    callWithErrorOverridesAsync<TParameters, TResult>(fn, args, prettifiers);
};
