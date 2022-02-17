import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { isEmpty, isNil } from "lodash/fp";
import { DataLoader, DataLoaders } from "../../data-loader";
import {
  LabelCreateInput,
  LabelService,
  LabelUpdateInput,
} from "../../labelflow";
import { Label, LabelClass } from "../../model";
import { PaginationFirstArg, PaginationSkipArg } from "../decorators";
import { LabelWhereInput, LabelWhereUniqueInput } from "../input";

@Resolver(() => Label)
export class LabelResolver {
  constructor(private readonly service: LabelService) {}

  @Mutation(() => Label)
  async createLabel(@Args("data") data: LabelCreateInput): Promise<Label> {
    return await this.service.create(data);
  }

  @Query(() => Label)
  async label(
    @Args("where", { type: () => LabelWhereUniqueInput })
    { id }: LabelWhereUniqueInput
  ): Promise<Label> {
    return this.service.findById(id);
  }

  @Query(() => [Label])
  labels(
    @Args("where", { type: () => LabelWhereInput, nullable: true })
    where?: LabelWhereInput,
    @PaginationFirstArg() first?: number,
    @PaginationSkipArg() skip?: number
  ): Promise<Label[]> {
    return this.service.findAll({ where, skip, take: first });
  }

  @ResolveField(() => [LabelClass], { nullable: true })
  async labelClass(
    @Parent() { labelClassId: id }: Label,
    @DataLoader() { labelClassId: loader }: DataLoaders
  ): Promise<LabelClass | undefined> {
    if (isNil(id) || isEmpty(id)) return undefined;
    return await loader.load(id);
  }

  @Mutation(() => Label)
  async updateLabel(
    @Args("where") where: LabelWhereUniqueInput,
    @Args("data") data: LabelUpdateInput
  ): Promise<Label> {
    await this.service.updateById(where.id, data);
    return await this.service.findOneOrFail({ where });
  }

  @Mutation(() => Label)
  async deleteLabel(
    @Args("where") { id }: LabelWhereUniqueInput
  ): Promise<Label> {
    const data = await this.service.findById(id);
    await this.service.deleteById(id);
    return data;
  }
}
