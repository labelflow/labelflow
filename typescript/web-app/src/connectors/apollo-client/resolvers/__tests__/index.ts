import localforage from "localforage";
import { createExample, example, examples } from "../example";

describe("Example resolver test suite", () => {
  test("Query example when db is empty", async () => {
    const queryResult = await examples();
    expect(queryResult.length).toBe(0);
  });
  test("Create example", async () => {
    const createResult = await createExample(undefined, { name: "test" });
    expect(createResult?.name).toBe("test");
    expect(await localforage.getItem(`Example:${createResult.id}`)).toBe(
      createResult
    );
  });
  test("Query example", async () => {
    const createResult = await createExample(undefined, { name: "test" });
    const queryResult = await example(undefined, { id: createResult.id });
    expect(queryResult).toBe(createResult);
  });
  test("Query examples", async () => {
    const createResult = await createExample(undefined, { name: "test" });
    const queryResult = await examples();
    expect(queryResult.length).toBe(3);
    expect(queryResult[queryResult.length - 1]).toBe(createResult);
  });
});
