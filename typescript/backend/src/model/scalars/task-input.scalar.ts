import { GraphQLScalarType, Kind, ValueNode } from "graphql";
import { TaskInput } from "labelflow-core";

export const TaskInputScalar = new GraphQLScalarType({
  name: "TaskInput",
  description: "Task input values",

  parseValue(value: string): TaskInput {
    return JSON.parse(value);
  },

  serialize(value: TaskInput): string {
    return JSON.stringify(value);
  },

  parseLiteral(ast: ValueNode): string | null {
    if (ast.kind === Kind.STRING) {
      return ast.value;
    }
    return null;
  },
});
