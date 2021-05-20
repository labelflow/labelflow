import {
  useQuery,
  ApolloProvider,
  useMutation,
  MutationFunctionOptions,
  FetchResult,
} from "@apollo/client";
import gql from "graphql-tag";
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

const createImageMutation = gql`
  mutation ($input: ImageCreateInput) {
    createImage(data: $input) {
      id
      name
    }
  }
`;

const importImage = (
  file: File | undefined,
  createImage: (
    options?: MutationFunctionOptions<any, Record<string, any>> | undefined
  ) => Promise<FetchResult<any, Record<string, any>, Record<string, any>>>
) => {
  if (file == null) {
    return;
  }
  const url = window.URL.createObjectURL(file);
  const image = new Image();
  image.onload = () => {
    createImage({
      variables: {
        input: {
          url,
          name: file.name,
          width: image.width,
          height: image.height,
        },
      },
    });
  };
  image.src = url;
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
        onChange={(e) => importImage(e?.target?.files?.[0], createImage)}
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
