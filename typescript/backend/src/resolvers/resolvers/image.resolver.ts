import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { DataLoader, DataLoaders } from "../../data-loader";
import {
  ImageCreateInput,
  ImageCreateManyInput,
  ImageService,
  ImageUpdateInput,
} from "../../labelflow";
import { Dataset, Image, Label } from "../../model";
import { PaginationFirstArg, PaginationSkipArg } from "../decorators";
import { ImageWhereInput, ImageWhereUniqueInput } from "../input";

@Resolver(() => Image)
export class ImageResolver {
  constructor(private readonly service: ImageService) {}

  @Query(() => Image)
  async image(
    @Args("where", { type: () => ImageWhereUniqueInput })
    { id }: ImageWhereUniqueInput
  ): Promise<Image> {
    return this.service.findById(id);
  }

  @Query(() => [Image])
  images(
    @Args("where", { type: () => ImageWhereInput, nullable: true })
    where?: ImageWhereInput,
    @PaginationFirstArg() first?: number,
    @PaginationSkipArg() skip?: number
  ): Promise<Image[]> {
    return this.service.findAll({ where, skip, take: first });
  }

  @ResolveField(() => [Label])
  labels(
    @Parent() { id }: Image,
    @DataLoader() { labelImageId }: DataLoaders
  ): Promise<Label[]> {
    return labelImageId.load(id);
  }

  @ResolveField(() => Dataset)
  dataset(
    @Parent() { id }: Image,
    @DataLoader() { datasetId }: DataLoaders
  ): Promise<Dataset> {
    return datasetId.load(id);
  }

  @Mutation(() => Image)
  createImage(
    @Args("data") input: ImageCreateInput,
    @Context() { req }: GraphQlContext
  ): Promise<Image> {
    return this.service.importAndCreate(input, req.headers.origin);
  }

  @Mutation(() => [Image])
  createManyImages(
    @Args("data") input: ImageCreateManyInput,
    @Context() { req }: GraphQlContext
  ): Promise<Image[]> {
    return this.service.importAndCreateMany(input, req.headers.origin);
  }

  @Mutation(() => Image)
  async updateImage(
    @Args("where") { id }: ImageWhereUniqueInput,
    @Args("data") data: ImageUpdateInput
  ): Promise<Image> {
    await this.service.updateById(id, data);
    return await this.service.findById(id);
  }

  @Mutation(() => Image)
  async deleteImage(
    @Args("where") { id }: ImageWhereUniqueInput
  ): Promise<Image> {
    const data = await this.service.findById(id);
    await this.service.deleteById(id);
    return data;
  }
}
