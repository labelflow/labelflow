import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NewDatasetCard } from "./new-dataset-card";

it("should call addDataset function when you click on the card", async () => {
  const addDatasetMock = jest.fn(() => {});
  render(<NewDatasetCard addDataset={addDatasetMock} />);
  userEvent.click(screen.getByText(/Create new dataset.../));
  expect(addDatasetMock).toHaveBeenCalled();
});
