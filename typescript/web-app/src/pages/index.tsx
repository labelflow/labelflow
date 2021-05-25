import { useQuery, ApolloProvider, useMutation } from "@apollo/client";
import gql from "graphql-tag";

import { Layout } from "../components/layout";
import { client } from "../connectors/apollo-client";
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
    <Layout>
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
    </Layout>
  );
};

const App = () => (
  <ApolloProvider client={client}>
    <IndexPage />
  </ApolloProvider>
);

export default App;
