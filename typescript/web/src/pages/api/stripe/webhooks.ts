import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { getPrismaClient } from "@labelflow/db";
import { WorkspacePlan } from "@labelflow/graphql-types";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("You need to provide a STRIPE_SECRET_KEY");
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
});

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable: NextApiRequest) {
  const chunks = [];
  // eslint-disable-next-line no-restricted-syntax
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

const relevantEvents = new Set([
  "customer.subscription.deleted",
  "customer.subscription.created",
  "customer.subscription.updated",
]);

const updateWorkspacePlan = async ({
  workspaceSlug,
  workspacePlan,
}: {
  workspaceSlug: string;
  workspacePlan: keyof typeof WorkspacePlan;
}) => {
  console.log("Here", workspaceSlug, workspacePlan);
  const prisma = await getPrismaClient();
  await prisma.workspace.update({
    where: { slug: workspaceSlug },
    data: { plan: workspacePlan },
  });
};

const manageSubscriptionStatusChange = async (
  subscription: Stripe.Subscription
) => {
  const { status } = subscription;
  console.log(`Subscription status is ${status}.`);
  if (status === "active") {
    const { workspaceSlug } = subscription.metadata;
    console.log("workspaceSlug", workspaceSlug);
    const newProductId = subscription.items.data[0].price.product;
    console.log("newProductId", newProductId);
    const product = await stripe.products.retrieve(newProductId as string);
    console.log("product", product);

    const productName = product.name;
    console.log("productName", productName);

    if (!(productName in WorkspacePlan)) {
      throw new Error(`Unknown plan ${productName}`);
    }
    const workspacePlan =
      WorkspacePlan[productName as keyof typeof WorkspacePlan];
    updateWorkspacePlan({ workspacePlan, workspaceSlug });
  }
};

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"];
    const webhookSecret =
      process.env.STRIPE_WEBHOOK_SECRET_LIVE ??
      process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new Error(
        "You need to provide a webhook secret through STRIPE_WEBHOOK_SECRET_LIVE or STRIPE_WEBHOOK_SECRET"
      );
    }
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        buf,
        sig as string,
        webhookSecret as string
      );
    } catch (err: any) {
      console.log(`❌ Error message: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message!}`);
    }

    if (relevantEvents.has(event.type)) {
      try {
        switch (event.type) {
          case "customer.subscription.deleted": {
            const subscription = event.data.object as Stripe.Subscription;
            const { workspaceSlug } = subscription.metadata;
            await updateWorkspacePlan({
              workspaceSlug,
              workspacePlan: WorkspacePlan.Community,
            });
            break;
          }
          case "customer.subscription.created":
          case "customer.subscription.updated":
            manageSubscriptionStatusChange(
              event.data.object as Stripe.Subscription
            );
            break;
          default:
            throw new Error("Unhandled relevant event: ");
        }
      } catch (error) {
        console.log(error);
        return res
          .status(400)
          .send('Webhook error: "Webhook handler failed. View logs."');
      }
    }

    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};

export default webhookHandler;
