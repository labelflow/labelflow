/**
 * Simple deferred class. Inspired by code from workbox-window
 */
export class Deferred<T> {
  promise: Promise<T>;

  resolve: (value: T | PromiseLike<T>) => void;

  reject: (reason?: any) => void;

  value: T | undefined;

  error: any | undefined;

  constructor() {
    this.resolve = () => {
      throw new Error(
        "Cannot resole deferred value, the promise is not created yet (This should never be possible)"
      );
    };
    this.reject = () => {
      throw new Error(
        "Cannot resole deferred value, the promise is not created yet (This should never be possible)"
      );
    };
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
    this.value = undefined;
    this.error = undefined;
    this.waitForValue();
  }

  reset() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
    this.value = undefined;
    this.error = undefined;
    this.waitForValue();
  }

  private async waitForValue() {
    try {
      this.value = await this.promise;
    } catch (error) {
      this.error = error;
    }
  }
}
