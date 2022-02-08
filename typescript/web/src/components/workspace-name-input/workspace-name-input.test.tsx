import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { isEmpty, isNil } from "lodash/fp";
import { WorkspaceNameInput } from ".";
import {
  TestCase,
  TestComponent,
  TEST_CASES,
} from "./workspace-name-input.fixtures";

jest.mock(
  "use-debounce",
  jest.fn(() => ({ useDebounce: (value: unknown) => [value] }))
);

const runTest = async ([props, expected]: TestCase): Promise<void> => {
  const { name } = props;
  const { getByLabelText } = render(<TestComponent {...props} />);
  if (!isNil(name) && !isEmpty(name)) {
    const inputElement = getByLabelText("workspace name input");
    userEvent.type(inputElement, name);
  }
  const messageElement = getByLabelText("workspace name message");
  await waitFor(() => expect(messageElement.innerHTML).toBe(expected));
};

describe(WorkspaceNameInput, () => {
  it.each(Object.entries(TEST_CASES))("%s", async (_, testCase) => {
    await runTest(testCase);
  });
});
