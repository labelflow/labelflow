/* eslint-disable import/first */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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

const renderNewProjectCard = () =>
  render(<NewProjectCard />, { wrapper: Wrapper });

it("should open the modal when you click on the card", async () => {
  renderNewProjectCard();

  userEvent.click(screen.getByText(/Create new project.../));

  waitFor(() => {
    expect(screen.getByLabelText(/project name input/i)).toBeDefined();
    expect(screen.getByLabelText(/create project/i)).toHaveAttribute(
      "disabled"
    );
  });
});

it("should reset the modal state after closing the modal", async () => {
  await renderNewProjectCard();

  userEvent.click(screen.getByText(/Create new project.../));

  await waitFor(() => {
    expect(screen.getByLabelText(/project name input/i)).toBeDefined();
    expect(screen.getByLabelText(/create project/i)).toHaveAttribute(
      "disabled"
    );
  });

  userEvent.type(
    screen.getByLabelText(/project name input/i),
    "my project name"
  );
  userEvent.click(screen.getByLabelText("Close"));

  await waitFor(() => {
    expect(
      screen.queryByLabelText(/project name input/i)
    ).not.toBeInTheDocument();
  });

  userEvent.click(screen.getByText(/Create new project.../));

  const input = screen.getByLabelText(
    /project name input/i
  ) as HTMLInputElement;

  await waitFor(() => {
    expect(input.value).toEqual("");
    expect(screen.getByLabelText(/create project/i)).toHaveAttribute(
      "disabled"
    );
  });
});
