/* eslint-disable import/first */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApolloProvider } from "@apollo/client";
import { PropsWithChildren } from "react";

import { client } from "../../../connectors/apollo-client-schema";
import { setupTestsWithLocalDatabase } from "../../../utils/setup-local-db-tests";
import { mockUseQueryParams } from "../../../utils/router-mocks";

mockUseQueryParams();

import { NewProjectCard } from "../new-project-card";

setupTestsWithLocalDatabase();

const Wrapper = ({ children }: PropsWithChildren<{}>) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);

it("should call addProject function when you click on the card", async () => {
  const addProjectMock = jest.fn(() => {});

  render(<NewProjectCard addProject={addProjectMock} />, { wrapper: Wrapper });

  userEvent.click(screen.getByText(/Create new project.../));

  expect(addProjectMock).toHaveBeenCalled();
});
