import { FunctionDefinition, ModuleDefinition, Task } from ".";

const LOG_FUNCTION: FunctionDefinition = {
  name: "add",
  summary: "Perform an addition on 2 values",
  input: [
    {
      name: "a",
      type: "number",
      summary: "First value to add",
    },
    {
      name: "b",
      type: "number",
      summary: "Second value to add",
    },
  ],
};

const CORE_MODULE: ModuleDefinition = {
  id: "212a98c4-a711-4f05-9617-ef8adc5ae322",
  name: "Core",
  summary: "Core module",
  functions: [LOG_FUNCTION],
};

const TEST_TASK: Task = {
  id: "340ee6f1-3b11-49b0-a0ae-9e144cf4eb0f",
  moduleId: CORE_MODULE.id,
  functionName: LOG_FUNCTION.name,
  input: { a: { value: 1 }, b: { value: 2 } },
};

describe("Task", () => {
  it("works", () => {
    expect(TEST_TASK).toMatchInlineSnapshot(`
      Object {
        "functionName": "add",
        "input": Object {
          "a": Object {
            "value": 1,
          },
          "b": Object {
            "value": 2,
          },
        },
        "moduleId": "212a98c4-a711-4f05-9617-ef8adc5ae322",
      }
    `);
  });
});
