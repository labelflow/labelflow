export const list =
  <ReturnedValue = unknown, Where extends Record<string, any> | null = null>(
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
      query.limit(first);
    }

    return query.toArray();
  };
