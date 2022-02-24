import { BadRequestException } from "@nestjs/common";
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
  DatasetCreateInput,
  DatasetService,
  DatasetUpdateInput,
} from "../../labelflow";
import { Dataset, Image, LabelClass, TotalCountAggregates } from "../../model";
import { PaginationFirstArg, PaginationSkipArg } from "../decorators";
import { DatasetWhereInput, DatasetWhereUniqueInput } from "../input";

const getUniqueInputWhere = ({
  id,
  slugs,
}: DatasetWhereUniqueInput):
  | Required<Pick<DatasetWhereUniqueInput, "id">>
  | Required<NonNullable<DatasetWhereUniqueInput["slugs"]>> => {
  if (!isNil(id) && !isEmpty(id)) return { id };
  if (isNil(slugs)) {
    throw new BadRequestException("ID or slugs must be defined");
  }
  const { slug, workspaceSlug } = slugs;
  if (
    !isNil(slug) &&
    !isEmpty(slug) &&
    !isNil(workspaceSlug) &&
    !isEmpty(workspaceSlug)
  ) {
    return { slug, workspaceSlug };
  }
  throw new BadRequestException("Both slug and workspaceSlug must be defined");
};

@Resolver(() => Dataset)
export class DatasetResolver {
  constructor(private readonly service: DatasetService) {}

  @Query(() => Dataset)
  async dataset(
    @Args("where", { type: () => DatasetWhereUniqueInput })
    input: DatasetWhereUniqueInput
  ): Promise<Dataset> {
    const where = getUniqueInputWhere(input);
    return this.service.findOneOrFail({ where });
  }

  // FIXME NEST Remove once #917 gets merged
  @Query(() => Dataset, { nullable: true })
  async searchDataset(
    @Args("where", { type: () => DatasetWhereUniqueInput })
    input: DatasetWhereUniqueInput
  ): Promise<Dataset | undefined> {
    const where = getUniqueInputWhere(input);
    return this.service.findOne({ where });
  }

  @Query(() => [Dataset])
  datasets(
    @Args("where", { type: () => DatasetWhereInput, nullable: true })
    where?: DatasetWhereInput,
    @PaginationFirstArg() first?: number,
    @PaginationSkipArg() skip?: number
  ): Promise<Dataset[]> {
    return this.service.findAll({ where, skip, take: first });
  }

  @Mutation(() => Dataset)
  async createDataset(
    @Args("data") data: DatasetCreateInput
  ): Promise<Dataset> {
    return await this.service.create(data);
  }

  @Mutation(() => Dataset)
  async updateDataset(
    @Args("where") input: DatasetWhereUniqueInput,
    @Args("data") data: DatasetUpdateInput
  ): Promise<Dataset> {
    const where = getUniqueInputWhere(input);
    if ("id" in where) {
      await this.service.updateById(where.id, data);
    } else {
      await this.service.updateBySlugs(where.workspaceSlug, where.slug, data);
    }
    return await this.service.findOneOrFail({ where });
  }

  @Mutation(() => Dataset) async deleteDataset(
    @Args("where") input: DatasetWhereUniqueInput
  ): Promise<Dataset> {
    const where = getUniqueInputWhere(input);
    const data = await this.service.findOneOrFail({ where });
    if ("id" in where) {
      await this.service.deleteById(where.id);
    } else {
      await this.service.deleteBySlugs(where.workspaceSlug, where.slug);
    }
    return data;
  }

  @ResolveField(() => [LabelClass])
  labelClasses(
    @Parent() data: Dataset,
    @DataLoader() { labelClassDatasetId }: DataLoaders
  ): Promise<LabelClass[]> {
    return labelClassDatasetId.load(data.id);
  }

  @ResolveField(() => [Image])
  images(
    @Parent() { id }: Dataset,
    @PaginationFirstArg() first: number,
    @PaginationSkipArg() skip: number,
    @DataLoader() { imageDatasetId }: DataLoaders
  ): Promise<Image[]> {
    return imageDatasetId.load({ id, first, skip });
  }

  @ResolveField(() => TotalCountAggregates)
  imagesAggregates(
    @Parent() { id }: Dataset,
    @DataLoader() { imagesDatasetIdCount }: DataLoaders
  ): Promise<TotalCountAggregates> {
    return imagesDatasetIdCount.load(id);
  }

  @ResolveField(() => TotalCountAggregates)
  labelsAggregates(
    @Parent() { id }: Dataset,
    @DataLoader() { labelsDatasetIdCount }: DataLoaders
  ): Promise<TotalCountAggregates> {
    return labelsDatasetIdCount.load(id);
  }

  @ResolveField(() => TotalCountAggregates)
  labelClassesAggregates(
    @Parent() { id }: Dataset,
    @DataLoader() { labelClassesDatasetIdCount }: DataLoaders
  ): Promise<TotalCountAggregates> {
    return labelClassesDatasetIdCount.load(id);
  }

  @ResolveField(() => Boolean)
  async datasetExists(
    @Args("where") input: DatasetWhereUniqueInput
  ): Promise<boolean> {
    const where = getUniqueInputWhere(input);
    const found = await this.service.findOne({ where });
    return !isNil(found);
  }
}
