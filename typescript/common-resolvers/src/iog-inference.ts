import { print, GraphQLResolveInfo } from "graphql";
import { MutationRunIogArgs } from "@labelflow/graphql-types";

// const ENDPOINT = "http://0.0.0.0:5000/graphql";
const ENDPOINT = "http://iog.labelflow.net/graphql";
// const ENDPOINT = "http://sterblue.ngrok.io/graphql";

const runIog = async (
  _parent: any,
  args: MutationRunIogArgs,
  _context: any,
  { operation }: GraphQLResolveInfo
) => {
  return await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      operationName: "runIog",
      query: print(operation),
      variables: args.data,
    }),
  }).then((res) =>
    res.json().then((parsedResponse) => parsedResponse.data.runIog)
  );
};

export default {
  Mutation: {
    runIog,
  },
};
