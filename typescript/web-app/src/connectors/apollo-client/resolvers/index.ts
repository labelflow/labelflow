import exampleGraphQL from "./example";

const entities = [exampleGraphQL];

export const resolvers = entities.reduce(
  (accumulator, { Query, Mutation }) => ({
    Query: { ...accumulator.Query, ...Query },
    Mutation: { ...accumulator.Mutation, ...Mutation },
  }),
  { Query: {}, Mutation: {} }
);
