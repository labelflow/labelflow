import { render, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchInput } from "./search-input";

describe("SearchInput", () => {
  it("displays the input correctly", () => {
    const { queryByLabelText } = render(<SearchInput />);
    expect(queryByLabelText(/clear search/i)).not.toBeInTheDocument();
  });

  it("displays the value passed in props and a clear button", async () => {
    const { getByTestId, getByLabelText } = render(
      <SearchInput value="hello there" />
    );
    const input = getByTestId("search-input-value") as HTMLInputElement;
    expect(input.value).toBe("hello there");
    const clearButton = getByLabelText(/clear search/i);
    expect(clearButton).toBeInTheDocument();
  });

  it("displays the text typed in and clears it when clear button is clicked", async () => {
    const { getByTestId, getByLabelText } = render(<SearchInput />);
    const input = getByTestId("search-input-value") as HTMLInputElement;
    userEvent.type(input, "hello there");
    expect(input.value).toBe("hello there");
    const clearButton = getByLabelText(/clear search/i);
    expect(clearButton).toBeInTheDocument();
    fireEvent.click(clearButton);
    await waitFor(() => expect(input.value).toBe(""));
  });
});
