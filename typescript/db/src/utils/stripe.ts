import {
  DbWorkspace,
  DEFAULT_WORKSPACE_PLAN,
} from "@labelflow/common-resolvers";
import { WorkspacePlan, WorkspaceStatus } from "@labelflow/graphql-types";
import { toEnumValue } from "@labelflow/utils";
import { pascalCase } from "change-case";
import { addDays, getUnixTime } from "date-fns";
import { isNil } from "lodash/fp";
import Stripe from "stripe";

const DAYS_OF_TRIAL = 14;

const STRIPE_ENV_VARIABLES_DEFINED =
  process.env.STRIPE_SECRET_KEY &&
  process.env.STRIPE_COMMUNITY_PLAN_PRICE_ID &&
  process.env.STRIPE_STARTER_PLAN_PRICE_ID &&
  process.env.STRIPE_PRO_PLAN_PRICE_ID;

const WORKSPACE_PLAN_PRICE_ID: Record<WorkspacePlan, string> = {
  Community: process.env.STRIPE_COMMUNITY_PLAN_PRICE_ID ?? "",
  Starter: process.env.STRIPE_STARTER_PLAN_PRICE_ID ?? "",
  Pro: process.env.STRIPE_PRO_PLAN_PRICE_ID ?? "",
};

const getPriceId = (
  metadata: Stripe.Emptyable<Stripe.MetadataParam> | undefined
): string => {
  const workspacePlan =
    metadata && typeof metadata.plan === "string"
      ? toEnumValue(WorkspacePlan, metadata.plan, DEFAULT_WORKSPACE_PLAN)
      : DEFAULT_WORKSPACE_PLAN;
  return WORKSPACE_PLAN_PRICE_ID[workspacePlan];
};

export function stripeIsDefined(
  stripeInstance: Stripe | undefined
): asserts stripeInstance is NonNullable<Stripe> {
  if (isNil(stripeInstance)) {
    throw new Error("Stripe has not been configured");
  }
}

export class StripeService {
  private readonly stripe?: Stripe = STRIPE_ENV_VARIABLES_DEFINED
    ? new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: "2020-08-27",
      })
    : undefined;

  public readonly hasStripe: boolean = !isNil(this.stripe);

  private readonly createCustomer = async (
    name: string,
    metadata?: Stripe.Emptyable<Stripe.MetadataParam>
  ): Promise<Stripe.Customer> => {
    stripeIsDefined(this.stripe);
    return await this.stripe.customers.create({ name, metadata });
  };

  private readonly createSubscription = async (
    customer: string,
    metadata?: Stripe.Emptyable<Stripe.MetadataParam>
  ): Promise<Stripe.Subscription> => {
    stripeIsDefined(this.stripe);
    const trialEndDate = addDays(new Date(), DAYS_OF_TRIAL);
    return await this.stripe.subscriptions.create({
      customer,
      metadata,
      items: [{ price: getPriceId(metadata), quantity: 1 }],
      trial_end: getUnixTime(trialEndDate),
    });
  };

  public readonly tryCreateCustomer = async (
    name: string,
    slug: string,
    plan: WorkspacePlan
  ): Promise<Partial<Pick<DbWorkspace, "stripeCustomerId" | "status">>> => {
    if (!this.hasStripe) return { status: WorkspaceStatus.Active };
    const { id } = await this.createCustomer(name, { name, slug });
    const { status } = await this.createSubscription(id, { slug, plan });
    return {
      stripeCustomerId: id,
      status: toEnumValue(WorkspaceStatus, pascalCase(status)),
    };
  };

  public readonly tryDeleteCustomer = async (
    customer: string
  ): Promise<void> => {
    if (!this.hasStripe) return;
    stripeIsDefined(this.stripe);
    await this.stripe.customers.del(customer);
  };

  public readonly createBillingPortalSession = async (
    customer: string,
    returnUrl: string
  ): Promise<string> => {
    stripeIsDefined(this.stripe);
    const { url } = await this.stripe.billingPortal.sessions.create({
      customer,
      return_url: returnUrl,
    });
    return url;
  };
}

export const stripe = new StripeService();
