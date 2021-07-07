import { print } from "graphql";

const ENDPOINT = "http://0.0.0.0:5000/graphql";

const iogInference = async (_, args, request, { operation }) => {
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
