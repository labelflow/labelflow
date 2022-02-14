import { throwIfResolvesToNil } from "./throw-if-resolves-to-nil";

describe(throwIfResolvesToNil, () => {
  it("does nothing if the function resolves to a defined value", async () => {
    const functionToWrap = jest.fn(() => true);
    const wrappedFunction = throwIfResolvesToNil(
      "This error shouldn't happen",
      functionToWrap
    );
    expect(await wrappedFunction()).toEqual(true);
  });

  it("forwards the parameters of wrappedFunction to the function to wrap", async () => {
    const functionToWrap = jest.fn((arg1, arg2, arg3) => arg1 + arg2 + arg3);
    const wrappedFunction = throwIfResolvesToNil(
      "This error shouldn't happen",
      functionToWrap
    );
    await wrappedFunction(1, 2, 3);
    expect(functionToWrap).toHaveBeenCalledWith(1, 2, 3);
  });

  it("throws the error message if the function resolves to undefined", async () => {
    const functionToWrap = jest.fn(() => undefined);
    const wrappedFunction = throwIfResolvesToNil(
      "This error should happen",
      functionToWrap
    );
    expect(() => wrappedFunction()).rejects.toThrow("This error should happen");
  });

  it("throws the error message if the function resolves to null", async () => {
    const functionToWrap = jest.fn(() => null);
    const wrappedFunction = throwIfResolvesToNil(
      "This error should happen",
      functionToWrap
    );
    expect(() => wrappedFunction()).rejects.toThrow("This error should happen");
  });
});
