import { flushPromises, sleep, timeout } from ".";

jest.useFakeTimers("legacy");

describe(timeout, () => {
  const resolve = jest.fn();
  const reject = jest.fn();

  beforeEach(() => {
    resolve.mockClear();
    reject.mockClear();
  });

  it("succeeds if the timeout is not elapsed", async () => {
    timeout(sleep(100), 200).then(resolve).catch(reject);
    jest.advanceTimersByTime(150);
    await flushPromises();
    expect(resolve).toHaveBeenCalledTimes(1);
    expect(reject).not.toHaveBeenCalled();
  });

  it("fails if the timeout is elapsed", async () => {
    timeout(sleep(200), 100).then(resolve).catch(reject);
    jest.advanceTimersByTime(150);
    await flushPromises();
    expect(resolve).not.toHaveBeenCalled();
    expect(reject).toHaveBeenCalledTimes(1);
  });
});
