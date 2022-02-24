import { registerEnumType } from "@nestjs/graphql";
import { EnumMetadataValuesMap } from "@nestjs/graphql/dist/schema-builder/metadata";
import { sentenceCase } from "change-case";
import * as ENUM_TYPES from "./index-enums";

export * from "./index-enums";

const getValuesMap = <TEnum extends object>(
  enumRef: TEnum
): EnumMetadataValuesMap<TEnum> =>
  Object.keys(enumRef).reduce(
    (config, key) => ({ ...config, [key]: { description: sentenceCase(key) } }),
    {}
  );

export const registerEnum = <TEnum extends object>(
  enumName: string,
  enumRef: TEnum
): void =>
  registerEnumType(enumRef, {
    name: enumName,
    description: sentenceCase(enumName),
    valuesMap: getValuesMap<TEnum>(enumRef),
  });

Object.entries(ENUM_TYPES).forEach((args) => registerEnum(...args));
