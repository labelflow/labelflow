import { CodeProps } from ".";

type Fixture = Pick<CodeProps, "children" | "language" | "inline">;

export const CODE_BLOCK_EXAMPLE: Fixture = {
  language: "typescript",
  children: [
    'const hello = (name: string = "world") => {',
    // eslint-disable-next-line no-template-curly-in-string
    "  console.log(`Hello ${name}!`);",
    "};",
  ].join("\n"),
};

export const SINGLE_LINE_CODE_EXAMPLE: Fixture = {
  language: "typescript",
  children: 'hello("Alice and Bob")',
};
