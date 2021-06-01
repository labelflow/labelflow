import {
  render,
  screen,
  // , waitFor
} from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";

import { ImageNav } from "..";

test("should display dashes when empty by default", async () => {
  // @ts-ignore
  render(<ImageNav />);

  expect(screen.queryByDisplayValue(/-/i)).toBeInTheDocument();
  expect(screen.queryByDisplayValue(/0/i)).not.toBeInTheDocument();

  expect(screen.queryByText(/-/i)).toBeInTheDocument();
  expect(screen.queryByText(/0/i)).not.toBeInTheDocument();
});

test("should display zero when empty image list", async () => {
  // @ts-ignore
  render(<ImageNav images={[]} />);

  expect(screen.queryByDisplayValue(/-/i)).toBeInTheDocument();
  expect(screen.queryByDisplayValue(/0/i)).not.toBeInTheDocument();

  expect(screen.queryByText(/-/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/0/i)).toBeInTheDocument();
});

test("should display one when only one image in list", async () => {
  // @ts-ignore
  render(<ImageNav imageId="a" images={[{ id: "a" }]} />);

  expect(screen.queryByDisplayValue(/-/i)).not.toBeInTheDocument();
  expect(screen.queryByDisplayValue(/0/i)).not.toBeInTheDocument();
  expect(screen.queryByDisplayValue(/1/i)).toBeInTheDocument();

  expect(screen.queryByText(/-/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/0/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/1/i)).toBeInTheDocument();
});
