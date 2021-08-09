import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { ApolloProvider, gql } from "@apollo/client";
import { PropsWithChildren } from "react";

import { client } from "../../../connectors/apollo-client/schema-client";
import { setupTestsWithLocalDatabase } from "../../../utils/setup-local-db-tests";
import { DeleteProjectModal } from "../delete-project-modal";

const Wrapper = ({ children }: PropsWithChildren<{}>) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);

setupTestsWithLocalDatabase();

const renderModal = (props = {}) => {
  return render(<DeleteProjectModal isOpen {...props} />, {
    wrapper: Wrapper,
  });
};

test("should delete a project when the button is clicked", async () => {
  const mutateResult = await client.mutate({
    mutation: gql`
      mutation {
        createProject(data: { name: "Toto" }) {
          id
        }
      }
    `,
  });

  const onClose = jest.fn();
  renderModal({ onClose, projectId: mutateResult.data.createProject.id });

  const button = screen.getByLabelText(/Project delete/i);
  fireEvent.click(button);

  await waitFor(() => {
    expect(onClose).toHaveBeenCalled();
  });

  return expect(
    client.query({
      query: gql`
        query getProjectById($id: ID) {
          project(where: { id: $id }) {
            name
          }
        }
      `,
      variables: { id: mutateResult.data.createProject.id },
      fetchPolicy: "no-cache",
    })
  ).rejects.toEqual(new Error("No project with such id"));
});

test("shouldn't delete a project when the cancel is clicked", async () => {
  const mutateResult = await client.mutate({
    mutation: gql`
      mutation {
        createProject(data: { name: "Toto" }) {
          id
        }
      }
    `,
  });

  const onClose = jest.fn();
  renderModal({ onClose, projectId: mutateResult.data.createProject.id });

  const button = screen.getByLabelText(/Cancel delete/i);
  fireEvent.click(button);

  await waitFor(() => {
    expect(onClose).toHaveBeenCalled();
  });

  await act(async () => {
    const queryResult = await client.query({
      query: gql`
        query getProjectById($id: ID) {
          project(where: { id: $id }) {
            name
          }
        }
      `,
      variables: { id: mutateResult.data.createProject.id },
      fetchPolicy: "no-cache",
    });

    expect(queryResult.data.project.name).toEqual("Toto");
  });
});
