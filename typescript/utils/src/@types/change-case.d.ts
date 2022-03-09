import { Options } from "change-case";
import {
  CamelCase,
  DelimiterCase,
  KebabCase,
  PascalCase,
  ScreamingSnakeCase,
  SnakeCase,
} from "type-fest";

export declare module "change-case" {
  export declare function camelCase<TValue extends string>(
    value: TValue,
    options?: Options
  ): CamelCase<TValue>;

  export declare function capitalCase<TValue extends string>(
    value: TValue,
    options?: Options
  ): DelimiterCase<PascalCase<TValue>, " ">;

  export declare function constantCase<TValue extends string>(
    value: TValue,
    options?: Options
  ): ScreamingSnakeCase<TValue>;

  export declare function dotCase<TValue extends string>(
    value: TValue,
    options?: Options
  ): DelimiterCase<Lowercase<TValue>, ".">;

  export declare function headerCase<TValue extends string>(
    value: TValue,
    options?: Options
  ): DelimiterCase<PascalCase<TValue>, "-">;

  export declare function noCase<TValue extends string>(
    value: TValue,
    options?: Options
  ): DelimiterCase<Lowercase<TValue>, " ">;

  export declare function paramCase<TValue extends string>(
    value: TValue,
    options?: Options
  ): KebabCase<TValue>;

  export declare function pascalCase<TValue extends string>(
    value: TValue,
    options?: Options
  ): PascalCase<TValue>;

  export declare function pathCase<TValue extends string>(
    value: TValue,
    options?: Options
  ): DelimiterCase<Lowercase<TValue>, "/">;

  export declare function sentenceCase<TValue extends string>(
    value: TValue,
    options?: Options
  ): Capitalize<DelimiterCase<Lowercase<TValue>, " ">>;

  export declare function snakeCase<TValue extends string>(
    value: TValue,
    options?: Options
  ): SnakeCase<TValue>;

  export declare function titleCase<TValue extends string>(
    value: TValue,
    options?: Options
  ): TValue;

  export declare function swapCase<TValue extends string>(
    value: TValue,
    options?: Options
  ): TValue;

  export declare function lowerCase<TValue extends string>(
    value: TValue,
    options?: Options
  ): Lowercase<TValue>;

  export declare function lowerCaseFirst<TValue extends string>(
    value: TValue,
    options?: Options
  ): Uncapitalize<TValue>;

  export declare function upperCase<TValue extends string>(
    value: TValue,
    options?: Options
  ): Uppercase<TValue>;

  export declare function upperCaseFirst<TValue extends string>(
    value: TValue,
    options?: Options
  ): Capitalize<TValue>;

  export declare function spongeCase<TValue extends string>(
    value: TValue,
    options?: Options
  ): string;
}
