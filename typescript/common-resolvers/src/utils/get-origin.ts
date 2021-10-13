declare let globalThis: ServiceWorkerGlobalScope;

export const getOrigin = (req?: Request) => {
  return (
    // In window or service worker
    globalThis?.location?.origin ??
    // In next JS server
    (req?.headers as any)?.origin ??
    // In next JS server
    req?.headers?.get?.("origin")
  );
};
