type ObjectWithNulls = { [key: string]: any };
type ObjectWithoutNulls = { [key: string]: Exclude<any, null> };

export function castObjectNullsToUndefined(
  item: ObjectWithNulls | undefined | null
): ObjectWithoutNulls;
export function castObjectNullsToUndefined(item: undefined | null): undefined;

export function castObjectNullsToUndefined(
  item: ObjectWithNulls | undefined | null
): ObjectWithoutNulls | undefined {
  if (item) {
    return Object.fromEntries(
      Object.entries(item as Object).map(([key, value]) => [
        key,
        value === null ? undefined : value,
      ])
    );
  }
  return undefined;
}
