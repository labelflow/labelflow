import { mergeAtIndex } from "../merge-at-index";

it("adds the second array in the first one at the specified index", () => {
  const originArray = ["origin1", "origin2", "origin3", "origin4", "origin5"];
  const addedArray = ["added1", "added2", "added3"];
  const indexWhereToAdd = 2;

  expect(mergeAtIndex(originArray, addedArray, indexWhereToAdd)).toEqual([
    "origin1",
    "origin2",
    "added1",
    "added2",
    "added3",
  ]);
});

it("keeps the parts after added array", () => {
  const originArray = ["origin1", "origin2", "origin3", "origin4", "origin5"];
  const addedArray = ["added1", "added2"];
  const indexWhereToAdd = 1;

  expect(mergeAtIndex(originArray, addedArray, indexWhereToAdd)).toEqual([
    "origin1",
    "added1",
    "added2",
    "origin4",
    "origin5",
  ]);
});

it("accept an index bigger than the origin array", () => {
  const originArray = ["origin1", "origin2", "origin3", "origin4", "origin5"];
  const addedArray = ["added1", "added2"];
  const indexWhereToAdd = 6;

  expect(mergeAtIndex(originArray, addedArray, indexWhereToAdd)).toEqual([
    "origin1",
    "origin2",
    "origin3",
    "origin4",
    "origin5",
    null,
    "added1",
    "added2",
  ]);
});
