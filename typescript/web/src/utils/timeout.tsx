// See https://advancedweb.hu/how-to-add-timeout-to-a-promise-in-javascript/
export const timeout = <X,>(
  promise: Promise<X>,
  time: number,
  reason: any = "Timeout"
): Promise<X> =>
  Promise.race([
    promise,
    new Promise<X>((_resolve, reject) =>
      setTimeout(() => reject(reason), time)
    ),
  ]);

export const sleep = (time: number) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};
