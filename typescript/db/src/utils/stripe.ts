import { WorkspacePlan } from "@labelflow/graphql-types";
import { DAYS_OF_TRIAL, DEFAULT_WORKSPACE_PLAN } from "@labelflow/utils";
import { getUnixTime, addDays } from "date-fns";
import { isNil } from "lodash/fp";
import Stripe from "stripe";

const planToStripePriceId: Record<WorkspacePlan, string> = {
  Community: process.env.STRIPE_COMMUNITY_PLAN_PRICE_ID ?? "",
  Starter: process.env.STRIPE_STARTER_PLAN_PRICE_ID ?? "",
  Pro: process.env.STRIPE_PRO_PLAN_PRICE_ID ?? "",
};

const getPrice = (
  metadata: Stripe.Emptyable<Stripe.MetadataParam> | undefined
): string => {
  if (metadata && !isNil(metadata.plan)) {
    return planToStripePriceId[metadata.plan as WorkspacePlan];
  }
  return planToStripePriceId[DEFAULT_WORKSPACE_PLAN];
};
export function stripeIsDefined(
  stripeInstance: Stripe | undefined
): asserts stripeInstance is NonNullable<Stripe> {
  if (isNil(stripeInstance)) {
    throw new Error("Stripe has not been configured");
  }
}

export class StripeService {
  private readonly stripe?: Stripe =
    process.env.STRIPE_SECRET_KEY &&
    process.env.STRIPE_COMMUNITY_PLAN_PRICE_ID &&
    process.env.STRIPE_STARTER_PLAN_PRICE_ID &&
    process.env.STRIPE_PRO_PLAN_PRICE_ID
      ? new Stripe(process.env.STRIPE_SECRET_KEY, {
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
    const price = getPrice(metadata);
    const items: Stripe.SubscriptionCreateParams.Item[] = [
      { price, quantity: 1 },
    ];
    const trialEndDate = addDays(new Date(), DAYS_OF_TRIAL);
    return await this.stripe.subscriptions.create({
      customer,
      metadata,
      items,
      trial_end: getUnixTime(trialEndDate),
    });
  };

  public readonly tryCreateCustomer = async (
    name: string,
    slug: string,
    plan: WorkspacePlan
  ): Promise<string | undefined> => {
    if (!this.hasStripe) return undefined;
    const { id } = await this.createCustomer(name, { name, slug });
    await this.createSubscription(id, { slug, plan });
    return id;
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
