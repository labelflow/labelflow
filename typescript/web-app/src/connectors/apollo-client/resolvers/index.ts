import example from "./example";

const entities = [example];

export const resolvers = entities.reduce(
  (accumulator, { Query, Mutation }) => ({
    Query: { ...accumulator.Query, ...Query },
    Mutation: { ...accumulator.Mutation, ...Mutation },
  }),
  { Query: {}, Mutation: {} }
);
