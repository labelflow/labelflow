import { BadRequestException } from "@nestjs/common";
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { isNil } from "lodash/fp";
import { DataLoader, DataLoaders } from "../../data-loader";
import {
  WorkspaceCreateInput,
  WorkspaceCreateOptions,
  WorkspaceService,
} from "../../labelflow";
import { Dataset, Membership, Workspace } from "../../model";
import { WorkerClientService } from "../../worker-client";
import { UserId } from "../decorators";
import { WorkspaceUpdateInput } from "../input";
import { WorkspaceWhereUniqueInput } from "../input/workspace.where.input";

@Resolver(() => Workspace)
export class WorkspaceResolver {
  constructor(
    private readonly worker: WorkerClientService,
    private readonly service: WorkspaceService
  ) {}

  @Mutation(() => Workspace)
  async createWorkspace(
    @Args("data") data: WorkspaceCreateInput,
    @Args("options") options: WorkspaceCreateOptions
  ): Promise<Workspace> {
    return await this.service.create(data, options);
  }

  @Query(() => Workspace)
  async workspace(
    @Args("where", { type: () => WorkspaceWhereUniqueInput })
    { id, slug }: WorkspaceWhereUniqueInput
  ): Promise<Workspace> {
    if (!id && !slug) {
      throw new BadRequestException("ID or slug must be defined");
    }
    return !id
      ? this.service.findOneOrFail({ where: { slug } })
      : this.service.findById(id);
  }

  @Query(() => [Workspace])
  workspaces(): Promise<Workspace[]> {
    return this.service.findAll();
  }

  @ResolveField(() => String)
  stripeCustomerPortalUrl(
    @Parent() data: Workspace,
    @UserId() userId: string
  ): Promise<string | undefined> {
    return this.service.getStripeCustomerPortalUrl(data, userId);
  }

  @ResolveField(() => [Dataset])
  datasets(
    @Parent() { id }: Workspace,
    @DataLoader() { datasetWorkspaceSlug }: DataLoaders
  ): Promise<Dataset[]> {
    return datasetWorkspaceSlug.load(id);
  }

  @ResolveField(() => [Membership])
  memberships(
    @Parent() { slug }: Workspace,
    @DataLoader() { membershipWorkspaceSlug }: DataLoaders
  ): Promise<Membership[]> {
    return membershipWorkspaceSlug.load(slug);
  }

  @Mutation(() => Workspace)
  async updateWorkspace(
    @Args("where") where: WorkspaceWhereUniqueInput,
    @Args("data") data: WorkspaceUpdateInput
  ): Promise<Workspace> {
    const { id } = await this.service.findOneOrFail({ where });
    this.service.updateById(id, data);
    return await this.service.findById(id);
  }

  @Mutation(() => Workspace)
  async deleteWorkspace(@Args("where") where: WorkspaceWhereUniqueInput) {
    const data = await this.service.findOneOrFail({ where });
    await this.service.deleteById(data.id);
    return data;
  }

  @Query(() => Boolean)
  async workspaceExists(
    @Args("where") where: WorkspaceWhereUniqueInput
  ): Promise<boolean> {
    const found = await this.service.findOne({ where });
    return !isNil(found);
  }

  @Mutation(() => Boolean)
  async testWorker(): Promise<boolean> {
    await this.worker.run({ name: "send-invitation", input: { wo: "rld" } });
    return true;
  }
}
