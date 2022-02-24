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
import { MembershipService, MembershipUpdateInput } from "../../labelflow";
import {
  CurrentUserCanAcceptInvitation,
  Membership,
  User,
  Workspace,
} from "../../model";
import { PaginationFirstArg, PaginationSkipArg, UserId } from "../decorators";
import { MembershipWhereInput, MembershipWhereUniqueInput } from "../input";

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

  @Mutation(() => Membership)
  async updateMembership(
    @Args("where") { id }: MembershipWhereUniqueInput,
    data: MembershipUpdateInput
  ): Promise<Membership> {
    await this.service.updateById(id, data);
    return await this.service.findById(id);
  }

  @Mutation(() => Membership)
  async deleteMembership(
    @Args("where") { id }: MembershipWhereUniqueInput
  ): Promise<Membership> {
    const data = await this.service.findById(id);
    await this.service.deleteById(id);
    return data;
  }

  @ResolveField(() => CurrentUserCanAcceptInvitation)
  async currentUserCanAcceptInvitation(
    @Parent()
    membership: Membership,
    @UserId() userId: string
  ): Promise<CurrentUserCanAcceptInvitation> {
    return await this.service.canAcceptInvitation(userId, membership);
  }

  @Mutation(() => Membership)
  async acceptInvitation(
    @Args("where") { id }: MembershipWhereUniqueInput,
    @UserId() userId: string
  ): Promise<Membership> {
    await this.service.acceptInvitation(userId, id);
    return await this.service.findById(id);
  }

  @Mutation(() => Membership)
  async declineInvitation(
    @Args("where") { id }: MembershipWhereUniqueInput,
    @UserId() userId: string
  ): Promise<Membership> {
    await this.service.declineInvitation(userId, id);
    return await this.service.findById(id);
  }
}
