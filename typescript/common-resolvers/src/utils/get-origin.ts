export const getOrigin = (req?: Request) => {
  return (req?.headers as any)?.origin ?? req?.headers?.get?.("origin");
};
