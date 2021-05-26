import { useEffect, useState, useRef } from "react";
import { isNumber, isUndefined, isNil } from "lodash";

export function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = useRef<() => void | null>();
  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  });
  // Set up the interval.
  useEffect(() => {
    function tick(): void {
      if (!isUndefined(savedCallback?.current)) {
        savedCallback?.current();
      }
    }
    if (!isNumber(delay)) {
      return undefined;
    }
    const id = setInterval(tick, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay]);
}

export function useLoadExternalLib(url: string): boolean {
  const [loaded, setLoaded] = useState(false);
  const existingScript = document.querySelector(`[src="${url}"]`);
  if (isNil(existingScript)) {
    const script = document.createElement("script");
    script.src = url;
    document.body.appendChild(script);
    script.onload = (): void => setLoaded(true);
  }
  return loaded;
}
