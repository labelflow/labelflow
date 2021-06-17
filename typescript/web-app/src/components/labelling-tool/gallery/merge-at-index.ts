/**
 * Takes to array and an index. Merge the second one in the first at the given index.
 * Note that this is not an insertion. The values of the second array will update the ones of the first
 * if they overlap.
 *
 * Note that it defaults to `null` everywhere for apollo cache to work.
 * If you wish to make this function more generic, you could take an extra argument with the default value.
 *
 * @param originArray The array where to merge the second array.
 * @param addedArray The array to merge at a given index.
 * @param indexWhereToAdd The index where the second array should be placed.
 * @returns
 */
export const mergeAtIndex = <OriginType = any, AddedType = OriginType>(
  originArray: Array<OriginType>,
  addedArray: Array<AddedType>,
  indexWhereToAdd: number
): Array<OriginType | AddedType | null> => {
  const newArray = Array(
    Math.max(originArray.length, indexWhereToAdd + addedArray.length)
  ).fill(null);

  newArray.forEach((_, index) => {
    if (index < indexWhereToAdd) {
      newArray[index] = originArray[index] ?? null;
    } else {
      newArray[index] =
        addedArray[index - indexWhereToAdd] ?? originArray[index] ?? null;
    }
  });

  return newArray;
};
