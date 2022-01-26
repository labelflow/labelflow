import { MockedResponse as ApolloResponse } from "@apollo/client/testing";
import { Dataset, Mutation, Query } from "@labelflow/graphql-types";
import { DATASET_LABEL_CLASSES_QUERY_WITH_COUNT } from "./dataset-classes.query";
import { LABEL_CLASS_EXISTS_QUERY } from "./upsert-class-modal/label-class-exists.query";

export const GRAPHQL_MOCKS: ApolloResponse<Partial<Query | Mutation>>[] = [
  {
    request: {
      query: LABEL_CLASS_EXISTS_QUERY,
      variables: { slug: "already-taken-name" },
    },
    result: { data: { labelClassExists: true } },
  },
  {
    request: { query: LABEL_CLASS_EXISTS_QUERY },
    result: { data: { labelClassExists: false } },
  },
  {
    request: {
      query: DATASET_LABEL_CLASSES_QUERY_WITH_COUNT,
      variables: { workspaceSlug: "local", datasetSlug: "test" },
    },
    result: {
      data: {
        dataset: {
          id: "0",
          name: "Test",
          labelClasses: [
            {
              id: "1",
              index: 0,
              name: "first",
              color: "#ff0000",
              labelsAggregates: { totalCount: 2 },
            },
            {
              id: "2",
              index: 1,
              name: "second",
              color: "#00ff00",
              labelsAggregates: { totalCount: 4 },
            },
            {
              id: "3",
              index: 2,
              name: "veeeeeeeeeeeeeeery loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong name",
              color: "#0000ff",
              labelsAggregates: { totalCount: 12 },
            },
          ],
        } as unknown as Dataset,
      },
    },
  },
];
