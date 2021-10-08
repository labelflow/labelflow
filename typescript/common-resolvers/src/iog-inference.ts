import { print, GraphQLResolveInfo } from "graphql";
import { MutationRunIogArgs } from "@labelflow/graphql-types";

const runIog = async (
  _parent: any,
  args: MutationRunIogArgs,
  _context: any,
  { operation }: GraphQLResolveInfo
) => {
  return await fetch(process.env.NEXT_PUBLIC_IOG_API_ENDPOINT, {
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
