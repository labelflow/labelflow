import { Args, Int } from "@nestjs/graphql";

export const PaginationFirstArg = () =>
  Args("first", { type: () => Int, nullable: true });

export const PaginationSkipArg = () =>
  Args("skip", { type: () => Int, nullable: true });
