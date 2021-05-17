import { useQuery, ApolloProvider } from "@apollo/client";
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

const IndexPage = () => {
  const { data: title } = useQuery(testQuery);
  const { data: projectsResult } = useQuery(projectsQuery);
  return (
    <div>
      <h1>{title?.hello}</h1>
      <div>
        {projectsResult?.projects
          ? projectsResult.projects.map((p) => (
              <p key={p.id}>
                {p.id} - {p.name}
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
