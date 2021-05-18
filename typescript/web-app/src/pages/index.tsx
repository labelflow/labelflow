import { useQuery, ApolloProvider, useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { client } from "../connectors/apollo-client";
import { Example } from "../types";

const testQuery = gql`
  query {
    hello
  }
`;

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
    createExample(name: $name) {
      id
      name
    }
  }
`;

const IndexPage = () => {
  const { data: title } = useQuery(testQuery);
  const { data: examplesResult } = useQuery(examplesQuery);
  const [createExample] = useMutation(createExamplesMutation, {
    refetchQueries: [{ query: examplesQuery }],
  });
  return (
    <div>
      <h1>{title?.hello}</h1>
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

const App = () => (
  <ApolloProvider client={client}>
    <IndexPage />
  </ApolloProvider>
);

export default App;
