export const reorderArrayMutable = <TValue>(
  array: TValue[],
  source: number,
  destination: number
): void => {
  const [value] = array.splice(source, 1);
  array.splice(destination, 0, value);
};

export const reorderArray = <TValue>(
  array: TValue[],
  source: number,
  destination: number
): TValue[] => {
  const result = [...array];
  reorderArrayMutable(result, source, destination);
  return result;
};
