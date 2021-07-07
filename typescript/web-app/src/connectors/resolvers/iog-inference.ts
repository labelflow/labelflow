import { print, GraphQLResolveInfo } from "graphql";
import { MutationIogInferenceArgs } from "../../graphql-types.generated";

const ENDPOINT = "http://0.0.0.0:5000/graphql";

const iogInference = async (
  _parent: any,
  args: MutationIogInferenceArgs,
  _context: any,
  { operation }: GraphQLResolveInfo
) => {
  return fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      operationName: "iogInference",
      query: print(operation),
      variables: args.data,
    }),
  }).then((res) =>
    res.json().then((parsedResponse) => parsedResponse.data.iogInference)
  );
};

export default {
  Mutation: {
    iogInference,
  },
};
