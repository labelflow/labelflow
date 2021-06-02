import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";

import { ImageNavigationTool } from "../image-navigation-tool";

test("should display dashes when empty by default", async () => {
  // @ts-ignore
  render(<ImageNavigationTool />);

  expect(screen.queryByDisplayValue(/-/i)).toBeInTheDocument();
  expect(screen.queryByDisplayValue(/0/i)).not.toBeInTheDocument();

  expect(screen.queryByText(/-/i)).toBeInTheDocument();
  expect(screen.queryByText(/0/i)).not.toBeInTheDocument();
});

test("should display zero when empty image list", async () => {
  // @ts-ignore
  render(<ImageNavigationTool images={[]} />);

  expect(screen.queryByDisplayValue(/-/i)).toBeInTheDocument();
  expect(screen.queryByDisplayValue(/0/i)).not.toBeInTheDocument();

  expect(screen.queryByText(/-/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/0/i)).toBeInTheDocument();
});

test("should display one when only one image in list", async () => {
  // @ts-ignore
  render(<ImageNavigationTool imageId="a" images={[{ id: "a" }]} />);

  expect(screen.queryByDisplayValue(/-/i)).not.toBeInTheDocument();
  expect(screen.queryByDisplayValue(/0/i)).not.toBeInTheDocument();
  expect(screen.queryByDisplayValue(/1/i)).toBeInTheDocument();

  expect(screen.queryByText(/-/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/0/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/1/i)).toBeInTheDocument();
});

test("should select previous image when the left arrow is pressed", async () => {
  const mockedRouter = { push: jest.fn() };

  const { container } = render(
    <ImageNavigationTool
      imageId="b"
      images={[{ id: "a" }, { id: "b" }, { id: "c" }]}
      // @ts-ignore
      router={mockedRouter}
    />
  );

  userEvent.type(container, "{arrowleft}");

  expect(mockedRouter.push).toHaveBeenCalledWith("/images/a");
});

test("should select next image when the right arrow is pressed", async () => {
  const mockedRouter = { push: jest.fn() };

  const { container } = render(
    <ImageNavigationTool
      imageId="b"
      images={[{ id: "a" }, { id: "b" }, { id: "c" }]}
      // @ts-ignore
      router={mockedRouter}
    />
  );

  userEvent.type(container, "{arrowright}");

  expect(mockedRouter.push).toHaveBeenCalledWith("/images/c");
});
