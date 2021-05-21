import localforage from "localforage";

export const getListFromStorage = async <EntityType = unknown>(
  listKey: string,
  pagination: { first?: number | null; skip?: number | null } = {}
): Promise<EntityType[]> => {
  const entityKeysList = await localforage.getItem<string[]>(listKey);

  if (entityKeysList === null) {
    return [];
  }

  const first = pagination.first ?? entityKeysList.length;
  const skip = pagination.skip ?? 0;

  const filteredKeys = entityKeysList.slice(skip, first + skip);

  return Promise.all(
    filteredKeys.map(
      (entityKey: string) =>
        localforage.getItem<EntityType>(entityKey) as Promise<EntityType>
    )
  );
};

export const appendToListInStorage = async <EntityType = string>(
  listKey: string,
  element: string
): Promise<EntityType[]> => {
  const oldEntityKeysList = await (<Promise<any[] | null>>(
    localforage.getItem(listKey)
  ));

  const newEntitiesList =
    oldEntityKeysList == null ? [element] : [...oldEntityKeysList, element];

  return localforage.setItem<EntityType[]>(listKey, newEntitiesList);
};
