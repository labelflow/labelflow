import { createContext, PropsWithChildren, useContext } from "react";

export class MockedLocation extends URL implements Location {
  ancestorOrigins = {} as DOMStringList; // Unused in our code

  /* eslint-disable class-methods-use-this */
  /* eslint-disable @typescript-eslint/no-unused-vars */
  assign(url: string | URL): void {
    throw new Error("Method not implemented.");
  }

  reload(): void {
    throw new Error("Method not implemented.");
  }

  replace(url: string | URL): void {
    throw new Error("Method not implemented.");
  }
  /* eslint-enable class-methods-use-this */
  /* eslint-enable @typescript-eslint/no-unused-vars */
}

export type MockableLocation = Location | MockedLocation;

export type MockableLocationState = { location: MockableLocation };

const MockableLocationContext = createContext({} as MockableLocationState);

export type MockableLocationProviderProps = PropsWithChildren<{
  location?: MockableLocation | string;
}>;

const getMockableLocation = (
  location: MockableLocationProviderProps["location"]
): MockableLocation => {
  return typeof location === "string"
    ? new MockedLocation(location)
    : location ?? globalThis.location;
};

export const MockableLocationProvider = ({
  location,
  children,
}: MockableLocationProviderProps) => (
  <MockableLocationContext.Provider
    value={{ location: getMockableLocation(location) }}
  >
    {children}
  </MockableLocationContext.Provider>
);

export const useMockableLocation = (): Location => {
  return useContext(MockableLocationContext).location;
};
