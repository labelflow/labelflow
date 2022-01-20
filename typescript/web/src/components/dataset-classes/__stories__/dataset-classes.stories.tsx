import { MockedProvider as ApolloProvider } from "@apollo/client/testing";
import React from "react";
import { DatasetClasses } from "..";
import { chakraDecorator } from "../../../utils/stories/chakra-decorator";
import { GRAPHQL_MOCKS } from "../dataset-classes.fixtures";

export default {
  title: "web/Dataset classes/Classes",
  decorators: [chakraDecorator],
};

export const Default = () => (
  <ApolloProvider mocks={GRAPHQL_MOCKS}>
    <DatasetClasses workspaceSlug="local" datasetSlug="test" />
  </ApolloProvider>
);
