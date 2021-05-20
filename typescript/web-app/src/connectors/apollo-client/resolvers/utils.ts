import localforage from "localforage";
import { isEmpty } from "lodash/fp";

export const getListFromStorage = async (key: string) => {
  const entityKeysList = await localforage.getItem(key);
  if (isEmpty(entityKeysList)) {
    return [];
  }
  return Promise.all(
    (entityKeysList as []).map((entityKey: string) =>
      localforage.getItem(entityKey)
    )
  );
};
