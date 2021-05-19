import { useQuery, ApolloProvider, useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { client } from "../connectors/apollo-client";
import { Example } from "../types";

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

const createImageMutation = gql`
  mutation ($input: ImageCreateInput) {
    createImage(data: $input) {
      id
      name
    }
  }
`;

const importImage = (file, createImage) => {
  const url = window.URL.createObjectURL(file);
  createImage({
    variables: { input: { url, name: "test image", width: 100, height: 100 } },
  });
};

const IndexPage = () => {
  const { data: examplesResult } = useQuery(examplesQuery);
  const [createExample] = useMutation(createExamplesMutation, {
    refetchQueries: [{ query: examplesQuery }],
  });
  const [createImage] = useMutation(createImageMutation);
  return (
    <div>
      <h1>Hello world</h1>
      <button
        type="button"
        onClick={() => createExample({ variables: { name: "Test" } })}
      >
        Add example
      </button>
      <input
        name="upload"
        type="file"
        onChange={(e) => importImage(e.target.files[0], createImage)}
      />
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
