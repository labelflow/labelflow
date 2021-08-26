/**
 * Generic function to list entities of a Dexie Table.
 * It needs the a dexie table and returns a function that handles
 * pagination and filtering.
 * Result is always ordered by createdAt. Feel free to change this function
 * to accept it as an argument.
 *
 * @param table The Dexie table for which we want to list items.
 *
 * @returns A function that accepts `where`, `skip` and `first` and return
 * an array of `Entity`. The list is properly paginated and filtered.
 */
export const list =
  <Entity = unknown, Where extends Record<string, any> | null = null>(
    table: Dexie.Table<Entity>,
    criterion = "createdAt"
  ) =>
  /**
   * A function which filters and list entities.
   * It properly implements pagination.
   *
   * @param where The filter condition associated with the entity.
   * @param skip The number of entities to skip in the result (defaults to 0).
   * @param first The number of entities to return (defaults to Infinity).
   * @returns An array of entities.
   */
  async (
    where?: Where | null,
    skip?: number | null,
    first?: number | null
  ): Promise<Entity[]> => {
    if (where) {
      const query = table.where(where);
      if (skip) {
        query.offset(skip);
      }
      if (first) {
        query.limit(first);
      }

      return await query.sortBy(criterion);
    }

    const query = table.orderBy(criterion);
    if (skip) {
      query.offset(skip);
    }
    if (first) {
      query.limit(first);
    }

    return await query.toArray();
  };
