import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { UserService, UserUpdateInput } from "../../labelflow";
import { Membership, User } from "../../model";
import { UserWhereUniqueInput } from "../input";

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly service: UserService) {}

  @Query(() => User)
  async user(
    @Args("where", { type: () => UserWhereUniqueInput })
    { id }: UserWhereUniqueInput
  ): Promise<User> {
    return await this.service.findById(id);
  }

  @Mutation(() => User)
  async updateUser(
    @Args("where", { type: () => UserWhereUniqueInput })
    { id }: UserWhereUniqueInput,
    @Args("data", { type: () => UserUpdateInput })
    data: UserUpdateInput
  ): Promise<User> {
    await this.service.updateById(id, data);
    return await this.service.findById(id);
  }

  @ResolveField(() => [Membership])
  async memberships(
    @Parent() data: User,
    @Context() { loaders }: GraphQlContext
  ): Promise<Membership[]> {
    return await loaders.membershipUserId.load(data.id);
  }
}
