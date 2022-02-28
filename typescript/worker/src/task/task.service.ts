import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import {
  FunctionDefinition,
  ModuleDefinition,
  Task,
  TaskInputValue,
} from "labelflow-core";
import { isNil } from "lodash/fp";

const ADD_FUNCTION: FunctionDefinition = {
  name: "add",
  input: [
    { name: "a", type: "number" },
    { name: "b", type: "number" },
  ],
  output: { name: "result", type: "number" },
  execute(a: number, b: number): number {
    return a + b;
  },
};

const MATH_MODULE: ModuleDefinition = {
  id: "4a287d4e-c825-4663-8cb5-65efe3e49f10",
  name: "Math",
  summary: "Mathematics utilities",
  functions: [ADD_FUNCTION],
};

const ALL_MODULES: Record<string, ModuleDefinition> = {
  [MATH_MODULE.id]: MATH_MODULE,
};

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  private readonly modules = ALL_MODULES;

  async execute(task: Task): Promise<unknown> {
    const functionDef = this.getFunctionDefinition(task);
    const inputValues = await this.parseValues(functionDef, task);
    const output = functionDef.execute(...inputValues);
    // eslint-disable-next-line @typescript-eslint/return-await
    return functionDef.output?.type === "promise" ? await output : output;
  }

  private getFunctionDefinition({
    moduleId,
    functionName,
  }: Task): FunctionDefinition {
    const moduleDef = this.modules[moduleId];
    if (isNil(moduleDef)) {
      throw new BadRequestException(`Cannot find module with ID ${moduleId}`);
    }
    const functionDef = moduleDef.functions.find(
      ({ name }) => name === functionName
    );
    if (isNil(functionDef)) {
      const msg = `No function named ${functionName} in module with ID ${moduleId}`;
      throw new BadRequestException(msg);
    }
    return functionDef;
  }

  private async parseValues(
    { input: inputDef }: FunctionDefinition,
    { input: inputValues }: Task
  ): Promise<unknown[]> {
    return await Promise.all(
      inputDef.map(async ({ name, nullable }) => {
        const value = inputValues[name];
        if (!isNil(value) && !nullable) return await this.parseValue(value);
        throw new BadRequestException(`Missing required argument ${name}`);
      })
    );
  }

  private async parseValue(inputValue: TaskInputValue): Promise<unknown> {
    if ("value" in inputValue) return inputValue.value;
    return await this.execute(inputValue);
  }
}
