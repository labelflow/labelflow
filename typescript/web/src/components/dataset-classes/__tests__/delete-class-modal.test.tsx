import { ApolloProvider } from "@apollo/client";
import { fireEvent, render, screen } from "@testing-library/react";
import { PropsWithChildren } from "react";
import { client } from "../../../connectors/apollo-client/schema-client";
import { setupTestsWithLocalDatabase } from "../../../utils/setup-local-db-tests";
import { TestComponent } from "../delete-label-class-modal.fixtures";

jest.mock("../../../connectors/apollo-client/schema-client", () => {
  const original = jest.requireActual(
    "../../../connectors/apollo-client/schema-client"
  );

  return {
    client: {
      ...original.client,
      clearStore: original.client.clearStore, // This needs to be passed like this otherwise the resulting object does not have the clearStore method
      mutate: jest.fn(original.client.mutate),
    },
  };
});

const Wrapper = ({ children }: PropsWithChildren<{}>) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);

setupTestsWithLocalDatabase();

const setDeleteClassId = jest.fn();

const renderModal = () => {
  render(<TestComponent setDeleteClassId={setDeleteClassId} />, {
    wrapper: Wrapper,
  });
};

describe("Class delete modal tests", () => {
  beforeEach(() => {
    setDeleteClassId.mockReset();
    (client.mutate as jest.Mock).mockReset();
  });

  test("should delete a class when confirm is clicked", async () => {
    renderModal();
    const confirmButton = screen.getByLabelText(/Confirm delete label class/);
    fireEvent.click(confirmButton);
    expect(setDeleteClassId).toHaveBeenCalledWith(undefined);
    expect(client.mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: { id: "2" },
      })
    );
  });

  test("shouldn't delete a class when cancel is clicked", async () => {
    renderModal();
    const cancelButton = screen.getByLabelText(/Cancel delete label class/);
    fireEvent.click(cancelButton);
    expect(setDeleteClassId).toHaveBeenCalledWith(undefined);
    expect(client.mutate).not.toHaveBeenCalled();
  });
});
