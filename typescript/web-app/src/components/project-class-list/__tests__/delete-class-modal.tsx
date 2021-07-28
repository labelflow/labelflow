import { render, screen, fireEvent } from "@testing-library/react";
import { ApolloProvider } from "@apollo/client";
import { PropsWithChildren } from "react";

import { client } from "../../../connectors/apollo-client-schema";
import { setupTestsWithLocalDatabase } from "../../../utils/setup-local-db-tests";
import { DeleteLabelClassModal } from "../delete-class-modal";

jest.mock("../../../connectors/apollo-client-schema", () => {
  const original = jest.requireActual(
    "../../../connectors/apollo-client-schema"
  );

  return {
    client: { ...original.client, mutate: jest.fn(original.client.mutate) },
  };
});

const Wrapper = ({ children }: PropsWithChildren<{}>) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);

setupTestsWithLocalDatabase();

const renderModal = (props = {}) => {
  return render(<DeleteLabelClassModal isOpen {...props} />, {
    wrapper: Wrapper,
  });
};

describe("Class delete modal tests", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("should delete a class when the button is clicked", async () => {
    const onClose = jest.fn();
    renderModal({ onClose, labelClassId: "Toto" });

    fireEvent.click(screen.getByLabelText(/Delete label class/i));

    expect(onClose).toHaveBeenCalled();
    expect(client.mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: { id: "Toto" },
      })
    );
  });

  test("shouldn't delete a class when the cancel is clicked", async () => {
    const onClose = jest.fn();
    renderModal({ onClose, labelClassId: "Toto" });

    fireEvent.click(screen.getByLabelText(/Cancel delete/i));

    expect(onClose).toHaveBeenCalled();
    expect(client.mutate).toHaveBeenCalledTimes(0);
  });
});
