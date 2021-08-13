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
import { DeleteDatasetModal } from "../delete-dataset-modal";

const Wrapper = ({ children }: PropsWithChildren<{}>) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);

setupTestsWithLocalDatabase();

const renderModal = (props = {}) => {
  return render(<DeleteDatasetModal isOpen {...props} />, {
    wrapper: Wrapper,
  });
};

test("should delete a dataset when the button is clicked", async () => {
  const mutateResult = await client.mutate({
    mutation: gql`
      mutation {
        createDataset(data: { name: "Toto" }) {
          id
        }
      }
    `,
  });

  const onClose = jest.fn();
  renderModal({ onClose, datasetId: mutateResult.data.createDataset.id });

  const button = screen.getByLabelText(/Dataset delete/i);
  fireEvent.click(button);

  await waitFor(() => {
    expect(onClose).toHaveBeenCalled();
  });

  return expect(
    client.query({
      query: gql`
        query getDatasetById($id: ID) {
          dataset(where: { id: $id }) {
            name
          }
        }
      `,
      variables: { id: mutateResult.data.createDataset.id },
      fetchPolicy: "no-cache",
    })
  ).rejects.toEqual(new Error("No dataset with such id"));
});

test("shouldn't delete a dataset when the cancel is clicked", async () => {
  const mutateResult = await client.mutate({
    mutation: gql`
      mutation {
        createDataset(data: { name: "Toto" }) {
          id
        }
      }
    `,
  });

  const onClose = jest.fn();
  renderModal({ onClose, datasetId: mutateResult.data.createDataset.id });

  const button = screen.getByLabelText(/Cancel delete/i);
  fireEvent.click(button);

  await waitFor(() => {
    expect(onClose).toHaveBeenCalled();
  });

  await act(async () => {
    const queryResult = await client.query({
      query: gql`
        query getDatasetById($id: ID) {
          dataset(where: { id: $id }) {
            name
          }
        }
      `,
      variables: { id: mutateResult.data.createDataset.id },
      fetchPolicy: "no-cache",
    });

    expect(queryResult.data.dataset.name).toEqual("Toto");
  });
});
