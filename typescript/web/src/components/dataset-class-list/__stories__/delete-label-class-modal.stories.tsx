import { MockedProvider as ApolloProvider } from "@apollo/client/testing";
import React from "react";
import { chakraDecorator } from "../../../utils/chakra-decorator";
import { TestComponent } from "../delete-label-class-modal.fixtures";
import { GRAPHQL_MOCKS } from "../label-classes.fixtures";

export default {
  title: "web/Delete label class modal",
  decorators: [chakraDecorator],
};

export const Default = () => (
  <ApolloProvider mocks={GRAPHQL_MOCKS}>
    <TestComponent />
  </ApolloProvider>
);
