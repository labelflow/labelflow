declare let self: ServiceWorkerGlobalScope;

export const getOrigin = (req?: Request) => {
  return (
    // In window or service worker
    self?.location?.origin ??
    // In next JS server
    (req?.headers as any)?.origin ??
    // In next JS server
    req?.headers?.get?.("origin")
  );
};
