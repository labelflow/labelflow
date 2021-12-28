import { isNil } from "lodash/fp";
import Stripe from "stripe";

export function stripeIsDefined(
  stripeInstance: Stripe | undefined
): asserts stripeInstance is NonNullable<Stripe> {
  if (isNil(stripeInstance)) {
    throw new Error("Stripe has not been configured");
  }
}

export class StripeService {
  private readonly stripe?: Stripe =
    process.env.STRIPE_SECRET_KEY && process.env.STRIPE_COMMUNITY_PLAN_PRICE_ID
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
    const freePlanPriceId = process.env.STRIPE_COMMUNITY_PLAN_PRICE_ID;
    const items: Stripe.SubscriptionCreateParams.Item[] = [
      { price: freePlanPriceId, quantity: 1 },
    ];
    return await this.stripe.subscriptions.create({
      customer,
      metadata,
      items,
    });
  };

  public readonly tryCreateCustomer = async (
    name: string,
    slug: string
  ): Promise<string | undefined> => {
    if (!this.hasStripe) return undefined;
    const { id } = await this.createCustomer(name, { name, slug });
    await this.createSubscription(id, { slug });
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
