import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { getSlug } from "labelflow-utils";
import { isEmpty, isNil } from "lodash/fp";
import { Repository } from "typeorm";
import { MembershipRole, Workspace, WorkspacePlan } from "../../model";
import { StripeService } from "../../stripe";
import { EntityService } from "../common";
import { WorkspaceCreateInput, WorkspaceCreateOptions } from "../input";
import { MembershipService } from "./membership.service";

@Injectable()
export class WorkspaceService extends EntityService<Workspace> {
  constructor(
    @InjectRepository(Workspace) repository: Repository<Workspace>,
    private readonly stripe: StripeService,
    private readonly memberships: MembershipService,
    private readonly config: ConfigService
  ) {
    super(Workspace, repository);
  }

  async create(
    { name, plan, ...data }: WorkspaceCreateInput,
    { createTutorial }: WorkspaceCreateOptions = {}
  ): Promise<Workspace> {
    if (createTutorial) {
      this.logger.warn("Tutorial creation is not implemented yet");
    }
    const slug = getSlug(name);
    const stripeId = await this.stripe.tryCreateCustomer(name, slug);
    return await super.create({
      ...data,
      name,
      slug,
      stripeCustomerId: stripeId,
      // FIXME NEST Remove the line below once the DB gets migrated
      plan: plan || WorkspacePlan.Pro,
    });
  }

  async deleteById(id: string): Promise<void> {
    await this.stripe.tryDeleteCustomer(id);
    return await super.deleteById(id);
  }

  async softDeleteById(id: string): Promise<void> {
    await this.stripe.tryDeleteCustomer(id);
    await super.softDeleteById(id);
  }

  async getStripeCustomerPortalUrl(
    { id: workspaceId, name, slug, stripeCustomerId }: Workspace,
    userId: string
  ): Promise<string | undefined> {
    if (!this.stripe.hasStripe) return undefined;
    await this.validateBillingAccess(userId, workspaceId, slug);
    const id = await this.ensureStripeCustomerId(stripeCustomerId, name, slug);
    if (isNil(id) || isEmpty(id)) return undefined;
    const origin = this.config.get("WEB_URL");
    const returnUrl = `${origin}/${slug}/settings`;
    return await this.stripe.createBillingPortalSession(id, returnUrl);
  }

  private async ensureStripeCustomerId(
    stripeCustomerId: string | undefined,
    name: string,
    slug: string
  ): Promise<string | undefined> {
    return !isEmpty(stripeCustomerId)
      ? stripeCustomerId
      : await this.stripe.tryCreateCustomer(name, slug);
  }

  private async validateBillingAccess(
    userId: string,
    workspaceId: string,
    slug: string
  ) {
    const membership = await this.memberships.findOne({
      where: { userId, workspaceId },
    });
    if (membership?.role === MembershipRole.Owner) return;
    throw new Error(
      `User must have the role "Owner" of the workspace ${slug} to access billing information`
    );
  }
}
