import {
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
  MutableRefObject,
} from "react";

export { useMap } from "./context";

export function useResource<T>(
  optionalRef?: MutableRefObject<T>
): MutableRefObject<T> {
  const [, forceUpdate] = useState(false);
  const localRef = useRef<T>(undefined as unknown as T);
  const ref = optionalRef ?? localRef;
  useLayoutEffect((): void => forceUpdate((i) => !i), []);
  return ref;
}

export function useUpdate<T>(
  callback: (props: T) => void,
  dependents: any[],
  optionalRef?: MutableRefObject<T>
): MutableRefObject<T> | MutableRefObject<undefined> {
  const localRef = useRef();
  const ref = optionalRef ?? localRef;
  const prevDependentsRef = useRef(dependents);

  useEffect(() => {
    prevDependentsRef.current = dependents;
  });

  useLayoutEffect(() => {
    if (ref.current && prevDependentsRef.current !== dependents) {
      callback(ref.current);
    }
  }, [callback, dependents, ref]);
  return ref;
}
