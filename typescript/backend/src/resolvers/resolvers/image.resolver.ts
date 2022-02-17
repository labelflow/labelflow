import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { DataLoader, DataLoaders } from "../../data-loader";
import { ImageService } from "../../labelflow";
import { Image, Label } from "../../model";
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
}
