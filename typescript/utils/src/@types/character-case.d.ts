/**
 * This file ensures name consistency between the type-fest and change-case types
 */

import {
  DelimiterCase,
  KebabCase,
  PascalCase,
  ScreamingSnakeCase,
} from "type-fest";

export type { CamelCase, SnakeCase } from "type-fest";

export type CapitalCase<TValue extends string> = DelimiterCase<
  PascalCase<TValue>,
  " "
>;

export type ConstantCase<TValue extends string> = ScreamingSnakeCase<TValue>;

export type DotCase<TValue extends string> = DelimiterCase<
  Lowercase<TValue>,
  "."
>;

export type HeaderCase<TValue extends string> = DelimiterCase<
  PascalCase<TValue>,
  "-"
>;

export type NoCase<TValue extends string> = DelimiterCase<
  Lowercase<TValue>,
  " "
>;

export type ParamCase<TValue extends string> = KebabCase<TValue>;

export type PathCase<TValue extends string> = DelimiterCase<
  Lowercase<TValue>,
  "/"
>;

export type SentenceCase<TValue extends string> = Capitalize<
  DelimiterCase<Lowercase<TValue>, " ">
>;

export type UppercaseFirst<TValue extends string> = Capitalize<TValue>;

export type LowercaseFirst<TValue extends string> = Uncapitalize<TValue>;
