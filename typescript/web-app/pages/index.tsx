import { useQuery, ApolloProvider, useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { client } from "../connectors/apollo-client";

const testQuery = gql`
  query {
    hello
  }
`;

const projectsQuery = gql`
  query {
    projects {
      id
      name
    }
  }
`;

const addProjectsMutation = gql`
  mutation ($name: String) {
    addProject(name: $name) {
      id
      name
    }
  }
`;

type Project = { id: string; name: string };

const IndexPage = () => {
  const { data: title } = useQuery(testQuery);
  const { data: projectsResult } = useQuery(projectsQuery);
  const [addProject] = useMutation(addProjectsMutation, {
    refetchQueries: [{ query: projectsQuery }],
  });
  return (
    <div>
      <h1>{title?.hello}</h1>
      <button
        type="button"
        onClick={() => addProject({ variables: { name: "Test" } })}
      >
        Add project
      </button>
      <div>
        {projectsResult?.projects
          ? projectsResult.projects.map((project: Project) => (
              <p key={project.id}>
                {project.id} - {project.name}
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
