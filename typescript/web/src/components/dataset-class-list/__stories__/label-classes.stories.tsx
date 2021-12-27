import { MockedProvider as ApolloProvider } from "@apollo/client/testing";
import React from "react";
import { LabelClasses } from "..";
import { chakraDecorator } from "../../../utils/chakra-decorator";
import { GRAPHQL_MOCKS } from "../label-classes.fixtures";

export default {
  title: "web/Dataset class list",
  decorators: [chakraDecorator],
};

export const Default = () => (
  <ApolloProvider mocks={GRAPHQL_MOCKS}>
    <LabelClasses workspaceSlug="local" datasetSlug="test" />
  </ApolloProvider>
);
