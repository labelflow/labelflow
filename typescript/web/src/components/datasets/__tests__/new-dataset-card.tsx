/* eslint-disable import/first */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApolloProvider } from "@apollo/client";
import { PropsWithChildren } from "react";

import { client } from "../../../connectors/apollo-client/schema-client";
import { setupTestsWithLocalDatabase } from "../../../utils/setup-local-db-tests";
import { mockUseQueryParams } from "../../../utils/router-mocks";

mockUseQueryParams();

import { NewDatasetCard } from "../new-dataset-card";

setupTestsWithLocalDatabase();

const Wrapper = ({ children }: PropsWithChildren<{}>) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);

it("should call addDataset function when you click on the card", async () => {
  const addDatasetMock = jest.fn(() => {});

  render(<NewDatasetCard addDataset={addDatasetMock} />, { wrapper: Wrapper });

  userEvent.click(screen.getByText(/Create new dataset.../));

  expect(addDatasetMock).toHaveBeenCalled();
});
