import localforage from "localforage";
import { isEmpty } from "lodash/fp";

export const getListFromStorage = async (listKey: string) => {
  const entityKeysList = await localforage.getItem(listKey);
  if (isEmpty(entityKeysList)) {
    return [];
  }
  return Promise.all(
    (entityKeysList as []).map((entityKey: string) =>
      localforage.getItem(entityKey)
    )
  );
};

export const appendToListInStorage = async (
  listKey: string,
  element: string
): Promise<any[]> => {
  const oldEntityKeysList = await (<Promise<any[] | null>>(
    localforage.getItem(listKey)
  ));

  const newEntitiesList =
    oldEntityKeysList == null ? [element] : [...oldEntityKeysList, element];

  return localforage.setItem(listKey, newEntitiesList);
};
