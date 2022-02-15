import { sleep } from "./sleep";

jest.useFakeTimers();

describe(sleep, () => {
  it("waits for the specified amount of time", async () => {
    const resolve = jest.fn();
    const reject = jest.fn();
    sleep(100).then(resolve).catch(reject);
    jest.advanceTimersByTime(50);
    await Promise.resolve();
    expect(resolve).not.toHaveBeenCalled();
    jest.advanceTimersByTime(50);
    await Promise.resolve();
    expect(resolve).toHaveBeenCalled();
  });
});
