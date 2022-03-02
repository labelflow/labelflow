import { BadRequestException } from "@nestjs/common";
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { DataLoader, DataLoaders } from "../../data-loader";
import { DatasetCreateInput, DatasetService } from "../../labelflow";
import { Dataset, Image, LabelClass, TotalCountAggregates } from "../../model";
import { PaginationFirstArg, PaginationSkipArg } from "../decorators";
import { DatasetWhereInput, DatasetWhereUniqueInput } from "../input";

@Resolver(() => Dataset)
export class DatasetResolver {
  constructor(private readonly service: DatasetService) {}

  @Query(() => Dataset)
  async dataset(
    @Args("where", { type: () => DatasetWhereUniqueInput })
    { id, slugs }: DatasetWhereUniqueInput
  ): Promise<Dataset> {
    if (!id && !slugs) {
      throw new BadRequestException("ID or slugs must be defined");
    }
    return !id
      ? this.service.findOneOrFail({ where: slugs })
      : this.service.findById(id);
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
}
