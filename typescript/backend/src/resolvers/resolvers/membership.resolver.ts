import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { isEmpty, isNil } from "lodash/fp";
import { DataLoader, DataLoaders } from "../../data-loader";
import { MembershipService } from "../../labelflow";
import { Membership, User, Workspace } from "../../model";
import { MembershipWhereInput, MembershipWhereUniqueInput } from "../input";
import { PaginationFirstArg, PaginationSkipArg } from "../decorators";

@Resolver(() => Membership)
export class MembershipResolver {
  constructor(private readonly service: MembershipService) {}

  @Query(() => Membership)
  async membership(
    @Args("where", { type: () => MembershipWhereUniqueInput })
    { id }: MembershipWhereUniqueInput
  ): Promise<Membership> {
    return this.service.findById(id);
  }

  @Query(() => [Membership])
  memberships(
    @Args("where", { type: () => MembershipWhereInput, nullable: true })
    where?: MembershipWhereInput,
    @PaginationFirstArg() first?: number,
    @PaginationSkipArg() skip?: number
  ): Promise<Membership[]> {
    return this.service.findAll({ where, take: first, skip });
  }

  @ResolveField(() => [Workspace])
  workspace(
    @Parent() { workspaceSlug: slug }: Membership,
    @DataLoader() { workspaceSlug }: DataLoaders
  ): Promise<Workspace> {
    return workspaceSlug.load(slug);
  }

  @ResolveField(() => [User])
  async user(
    @Parent() { userId: id }: Membership,
    @DataLoader() { userId }: DataLoaders
  ): Promise<User | undefined> {
    if (isEmpty(id) || isNil(id)) return undefined;
    return await userId.load(id);
  }
}
