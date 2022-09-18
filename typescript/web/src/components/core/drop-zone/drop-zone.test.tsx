import { fireEvent, render, RenderResult } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DropZone } from ".";

const TEST_FILE = new File(["(⌐□_□)"], "chuck-norris.png", {
  type: "image/png",
});

class MockedFileList implements FileList {
  [index: number]: File;

  length: number;

  constructor(files: File[] = []) {
    this.length = files.length;
    files.forEach((file, index) => {
      this[index] = file;
    });
  }

  item(index: number): File | null {
    return this[index] ?? null;
  }
}

const TEST_FILES: FileList = new MockedFileList([TEST_FILE]);

const TEST_DROP_ARG: DragEvent = {
  dataTransfer: { files: TEST_FILES } as DataTransfer,
} as DragEvent;

const onDrop = jest.fn();

const renderWithOnDrop = (): RenderResult =>
  render(<DropZone onDrop={onDrop} />);

const expectDrop = () => {
  expect(onDrop).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining(TEST_FILES)
  );
};

describe("DropZone", () => {
  beforeEach(() => {
    onDrop.mockClear();
  });

  it("calls onDrop when a file has been dropped", () => {
    const { getByTestId } = renderWithOnDrop();
    const box = getByTestId("drop-zone-box");
    fireEvent.drop(box, TEST_DROP_ARG);
    expectDrop();
  });

  it("calls onDrop when the file input value has changed", () => {
    const { getByTestId } = renderWithOnDrop();
    const input = getByTestId("drop-zone-input");
    userEvent.upload(input, TEST_FILE);
    expectDrop();
  });
});
