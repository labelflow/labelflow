import dynamic from "next/dynamic";

import { Layout } from "../components/layout";

const GraphiQL = dynamic(() => import("../components/graphiql"), {
  ssr: false,
  loading: ({ error }) => {
    if (error) throw error;
    return <div>loading</div>;
  },
});

const GraphqlPlayground = () => {
  return (
    <Layout>
      <div style={{ height: "100%", width: "100%", borderTop: "solid 1px" }}>
        <GraphiQL />
      </div>
    </Layout>
  );
};

export default GraphqlPlayground;
