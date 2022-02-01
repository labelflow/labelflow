import { isNil } from "lodash/fp";
import { Context, createContext, PropsWithChildren, useContext } from "react";

export type OptionalContextProviderProps<TValue> = PropsWithChildren<{
  value?: TValue;
}>;

export type OptionalContextProvider<TValue> = ({
  value,
  children,
}: OptionalContextProviderProps<TValue>) => JSX.Element;

const createOptionalContextProvider =
  <TValue,>(
    Optional: Context<TValue | undefined>,
    Required: Context<NonNullable<TValue>>
  ) =>
  ({ value, children }: OptionalContextProviderProps<TValue>) =>
    (
      <Optional.Provider value={value}>
        {isNil(value) ? (
          children
        ) : (
          <Required.Provider value={value as NonNullable<TValue>}>
            {children}
          </Required.Provider>
        )}
      </Optional.Provider>
    );

export const createOptionalContext = <TValue,>(
  initialValue: TValue | undefined = undefined
): [
  OptionalContextProvider<TValue>,
  () => TValue | undefined,
  () => NonNullable<TValue>
] => {
  const optional = createContext<TValue | undefined>(initialValue);
  const required = createContext<NonNullable<TValue>>(
    undefined as unknown as NonNullable<TValue>
  );
  return [
    createOptionalContextProvider<TValue>(optional, required),
    () => useContext(optional),
    () => useContext(required),
  ];
};
