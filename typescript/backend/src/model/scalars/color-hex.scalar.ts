import { GraphQLScalarType, Kind, ValueNode } from "graphql";

export const ColorHex = new GraphQLScalarType({
  name: "ColorHex",
  description: "Color hex code",

  parseValue(value: string): string {
    return value;
  },

  serialize(value: string): string {
    return value;
  },

  parseLiteral(ast: ValueNode): string | null {
    if (ast.kind === Kind.STRING) {
      return ast.value;
    }
    return null;
  },
});
