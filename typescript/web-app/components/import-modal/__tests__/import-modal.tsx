import { render, screen, waitFor } from "@testing-library/react";
import { ImportModal } from "../import-modal";
import userEvent from "@testing-library/user-event";

test("Should be renamed", async () => {
  const file = new File(["Hello"], "hello.png", { type: "image/png" });

  render(<ImportModal />);

  const input = screen.getByLabelText(/drop folders or images/i);

  await waitFor(() => userEvent.upload(input, file));

  // @ts-ignore
  expect(input.files).toHaveLength(1);
});
