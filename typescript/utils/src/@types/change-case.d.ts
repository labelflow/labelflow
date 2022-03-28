/**
 * This file contains extended types for the change-case package.
 * Basically, it maps the type-fest special string types to the change-case
 * functions so that we can have stronger typing when dealing with different
 * text character-cases across the source code.
 *
 * ```ts
 * import { paramCase } from "change-case";
 * // ParamCase is an alias for the type-fest KebabCase type
 * import { ParamCase } from "type-fest";
 *
 * // Declare some JS-type camelCase options
 * type OptionName = "enableXXX" | "printYYY";
 *
 * // In this example, a command-flag must start with `--` and be one of the
 * // possible OptionName values **but** with param-case.
 * type CommandFlag = `--${ParamCase<OptionName>}`;
 *
 * // Just a dummy function which only accepts a CommandFlag value
 * const printCommand = (flag: CommandFlag): string => console.log(`some-executable ${flag}`);
 *
 * // Without this package: inferred as `string`
 * // With this package: inferred as `--${ParamCase<OptionName>}`
 * const flag = `--${paramCase("enableXXX")}`;
 *
 * // Without this package: compiler fail as string is less restrictive than CommandFlag
 * // With this package: compiler success, return type is the literal value `--enable-xxx`
 * printCommand(flag);
 * ```
 */

import { Options } from "change-case";
import {
  CamelCase,
  CapitalCase,
  ConstantCase,
  DotCase,
  HeaderCase,
  NoCase,
  ParamCase,
  PascalCase,
  PathCase,
  SentenceCase,
  SnakeCase,
  LowerCaseFirst,
  UppercaseFirst,
} from "./character-case";

export declare module "change-case" {
  export declare function camelCase<TValue extends string>(
    value: TValue,
    options?: Options
  ): CamelCase<TValue>;

  export declare function capitalCase<TValue extends string>(
    value: TValue,
    options?: Options
  ): CapitalCase<TValue>;

  export declare function constantCase<TValue extends string>(
    value: TValue,
    options?: Options
  ): ConstantCase<TValue>;

  export declare function dotCase<TValue extends string>(
    value: TValue,
    options?: Options
  ): DotCase<TValue>;

  export declare function headerCase<TValue extends string>(
    value: TValue,
    options?: Options
  ): HeaderCase<TValue>;

  export declare function noCase<TValue extends string>(
    value: TValue,
    options?: Options
  ): NoCase<TValue>;

  export declare function paramCase<TValue extends string>(
    value: TValue,
    options?: Options
  ): ParamCase<TValue>;

  export declare function pascalCase<TValue extends string>(
    value: TValue,
    options?: Options
  ): PascalCase<TValue>;

  export declare function pathCase<TValue extends string>(
    value: TValue,
    options?: Options
  ): PathCase<TValue>;

  export declare function sentenceCase<TValue extends string>(
    value: TValue,
    options?: Options
  ): SentenceCase<TValue>;

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
  ): LowerCaseFirst<TValue>;

  export declare function upperCase<TValue extends string>(
    value: TValue,
    options?: Options
  ): Uppercase<TValue>;

  export declare function upperCaseFirst<TValue extends string>(
    value: TValue,
    options?: Options
  ): UppercaseFirst<TValue>;

  export declare function spongeCase<TValue extends string>(
    value: TValue,
    options?: Options
  ): string;
}
