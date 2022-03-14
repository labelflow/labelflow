import { Logger } from "./logger";

export type DefinitionDocumentation = {
  name: string;
  summary?: string;
  description?: string;
};

export type TypeDefinitionType =
  | "string"
  | "number"
  | "integer"
  | "boolean"
  | "enum"
  | "array"
  | "tuple"
  | "set"
  | "anyOf"
  | "oneOf"
  | "object"
  | "promise"
  | "task"
  | "unknown";

export type BaseTypeDefinition<TType extends TypeDefinitionType> =
  DefinitionDocumentation & {
    type: TType;
    nullable?: boolean;
  };

export type StringTypeDefinition = BaseTypeDefinition<"string">;

export type NumberTypeDefinition<
  TNumberType extends TypeDefinitionType = "number"
> = BaseTypeDefinition<TNumberType> & {
  min?: number;
  max?: number;
};

export type IntegerTypeDefinition = NumberTypeDefinition<"integer">;

export type BooleanTypeDefinition = BaseTypeDefinition<"boolean">;

export type EnumTypeDefinition = BaseTypeDefinition<"enum"> & {
  enum: string[];
};

export type ArrayTypeDefinition = BaseTypeDefinition<"array"> & {
  of: TypeDefinition;
};

export type TupleTypeDefinition = BaseTypeDefinition<"tuple"> & {
  of: TypeDefinition[];
};

export type SetTypeDefinition = BaseTypeDefinition<"set"> & {
  of: TypeDefinition;
};

export type OneOfTypeDefinition = BaseTypeDefinition<"oneOf"> & {
  of: TypeDefinition[];
};

export type AnyOfTypeDefinition = BaseTypeDefinition<"anyOf"> & {
  of: TypeDefinition[];
};

export type ObjectTypeDefinition = BaseTypeDefinition<"object"> & {
  of: TypeDefinition[];
};

export type PromiseTypeDefinition = BaseTypeDefinition<"promise"> & {
  of: TypeDefinition;
};

export type UnknownTypeDefinition = BaseTypeDefinition<"unknown">;

export interface TaskTypeDefinition
  extends BaseTypeDefinition<"task">,
    Pick<FunctionDefinition, "input" | "output"> {}

export type TypeDefinition =
  | UnknownTypeDefinition
  | StringTypeDefinition
  | NumberTypeDefinition
  | IntegerTypeDefinition
  | BooleanTypeDefinition
  | EnumTypeDefinition
  | ArrayTypeDefinition
  | TupleTypeDefinition
  | SetTypeDefinition
  | AnyOfTypeDefinition
  | OneOfTypeDefinition
  | ObjectTypeDefinition
  | PromiseTypeDefinition
  | TaskTypeDefinition;

export type FunctionDefinition<
  TArgs extends [...any] = [...any],
  TReturn = unknown,
  TInput extends TypeDefinition[] = TypeDefinition[],
  TOutput extends TypeDefinition = TypeDefinition
> = DefinitionDocumentation & {
  input: TInput;
  output?: TOutput;
  execute: (...args: [...TArgs]) => TReturn;
};

export type ModuleDefinition = DefinitionDocumentation & {
  id: string;
  functions: FunctionDefinition[];
};

export type Value<TValue = unknown> = {
  value: TValue;
};

export type TaskInputValue = Value | Task;

export type TaskInput = Record<string, TaskInputValue>;

export type Task = Partial<DefinitionDocumentation> & {
  id: string;
  moduleId: string;
  functionName: string;
  input: TaskInput;
};

export type TaskContext = {
  logger: Logger;
  execute(task: Task): Promise<unknown>;
};
