export const list =
  <ReturnedValue = any, Where = Record<string, any>>(
    table: Dexie.Table<ReturnedValue>
  ) =>
  async (
    where?: Where | null,
    skip?: number | null,
    first?: number | null
  ): Promise<ReturnedValue[]> => {
    if (where) {
      const query = table.where(where);
      if (skip) {
        query.offset(skip);
      }
      if (first) {
        query.limit(first);
      }

      return query.sortBy("createdAt");
    }

    const query = table.orderBy("createdAt");
    if (skip) {
      query.offset(skip);
    }
    if (first) {
      return query.limit(first).toArray();
    }

    return query.toArray();
  };
