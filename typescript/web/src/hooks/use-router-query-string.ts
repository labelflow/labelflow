import { isEmpty } from "lodash/fp";
import { useRouter } from "next/router";

export const useRouterQueryString = (name: string): string => {
  const router = useRouter();
  const value = router?.query[name];
  // FIXME We should throw an error here but most of the consuming code shows
  // its content regardless of whether there is a slug available or not
  return (typeof value === "string" ? value : value?.[0]) ?? "";
};

export const useHasRouterQueryString = (name: string): boolean => {
  const router = useRouter();
  return !isEmpty(router?.query[name]);
};
