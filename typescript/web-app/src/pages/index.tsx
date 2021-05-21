import {
  useQuery,
  useMutation,
  MutationFunctionOptions,
  FetchResult,
} from "@apollo/client";
import gql from "graphql-tag";
import localforage from "localforage";
import { v4 as uuidv4 } from "uuid";

import { Example } from "../types.generated";

const examplesQuery = gql`
  query {
    examples {
      id
      name
    }
  }
`;

const createExamplesMutation = gql`
  mutation ($name: String) {
    createExample(data: { name: $name }) {
      id
      name
    }
  }
`;

const IndexPage = () => {
  const { data: examplesResult } = useQuery(examplesQuery);
  const [createExample] = useMutation(createExamplesMutation, {
    refetchQueries: [{ query: examplesQuery }],
  });
  return (
    <div>
      <h1>Hello world</h1>
      <button
        type="button"
        onClick={() => createExample({ variables: { name: "Test" } })}
      >
        Add example
      </button>
      <div>
        {examplesResult?.examples
          ? examplesResult.examples.map((example: Example) => (
              <p key={example.id}>
                {example.id} - {example.name}
              </p>
            ))
          : null}
      </div>
    </div>
  );
};

export default IndexPage;
