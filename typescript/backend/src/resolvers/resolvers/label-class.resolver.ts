import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { isNil } from "lodash/fp";
import { DataLoader, DataLoaders } from "../../data-loader";
import {
  LabelClassCreateInput,
  LabelClassService,
  LabelClassUpdateInput,
} from "../../labelflow";
import { Label, LabelClass, TotalCountAggregates } from "../../model";
import { PaginationFirstArg, PaginationSkipArg } from "../decorators";
import {
  LabelClassReorderInput,
  LabelClassWhereInput,
  LabelClassWhereUniqueInput,
} from "../input";

@Resolver(() => LabelClass)
export class LabelClassResolver {
  constructor(private readonly service: LabelClassService) {}

  @Query(() => LabelClass)
  async labelClass(
    @Args("where", { type: () => LabelClassWhereUniqueInput })
    { id }: LabelClassWhereUniqueInput
  ): Promise<LabelClass> {
    return this.service.findById(id);
  }

  @Query(() => [LabelClass])
  labelClasses(
    @Args("where", { type: () => LabelClassWhereInput, nullable: true })
    where?: LabelClassWhereInput,
    @PaginationFirstArg() first?: number,
    @PaginationSkipArg() skip?: number
  ): Promise<LabelClass[]> {
    return this.service.findAll({
      where,
      skip,
      take: first,
      order: { index: "ASC" },
    });
  }

  @Mutation(() => LabelClass)
  async createLabelClass(
    @Args("data") data: LabelClassCreateInput
  ): Promise<LabelClass> {
    return await this.service.create(data);
  }

  @Mutation(() => LabelClass)
  async updateLabelClass(
    @Args("where") { id }: LabelClassWhereUniqueInput,
    @Args("data") data: LabelClassUpdateInput
  ): Promise<LabelClass> {
    await this.service.updateById(id, data);
    return await this.service.findById(id);
  }

  @Mutation(() => LabelClass)
  async deleteLabelClass(
    @Args("where") { id }: LabelClassWhereUniqueInput
  ): Promise<LabelClass> {
    const deleted = await this.service.findById(id);
    await this.service.deleteById(id);
    return deleted;
  }

  @Mutation(() => LabelClass)
  async reorderLabelClass(
    @Args("where") { id }: LabelClassWhereUniqueInput,
    @Args("data") { index }: LabelClassReorderInput
  ): Promise<LabelClass> {
    await this.service.reorder(id, index);
    return await this.service.findById(id);
  }

  @ResolveField(() => [Label])
  labels(
    @Parent() data: LabelClass,
    @Context() { loaders }: GraphQlContext
  ): Promise<Label[]> {
    return loaders.labelLabelClassId.load(data.id);
  }

  @ResolveField(() => TotalCountAggregates)
  labelsAggregates(
    @Parent() { id }: LabelClass,
    @DataLoader() { labelsLabelClassIdCount }: DataLoaders
  ): Promise<TotalCountAggregates> {
    return labelsLabelClassIdCount.load(id);
  }

  @Query(() => Boolean)
  async labelClassExists(
    @Args("where") where: LabelClassWhereInput
  ): Promise<boolean> {
    const found = await this.service.findOne({ where });
    return !isNil(found);
  }
}
