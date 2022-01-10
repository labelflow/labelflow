export const addTypename = <TRecord extends object, TTypename extends string>(
  data: TRecord,
  typename: TTypename
): TRecord & { __typename: TTypename } => {
  return { ...data, __typename: typename };
};

export const addTypenames = <TRecord extends object, TTypename extends string>(
  data: TRecord[],
  typename: TTypename
): (TRecord & { __typename: TTypename })[] => {
  return data.map((item) => addTypename<TRecord, TTypename>(item, typename));
};
