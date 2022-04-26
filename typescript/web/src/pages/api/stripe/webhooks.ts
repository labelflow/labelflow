import { getPrismaClient } from "@labelflow/db";
import { WorkspaceStatus } from "@labelflow/graphql-types";
import { toEnumValue } from "@labelflow/utils";
import { pascalCase } from "change-case";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { WorkspacePlan } from "../../../graphql-types/globalTypes";

const {
  STRIPE_SECRET_KEY: stripeSecretKey,
  STRIPE_WEBHOOK_SECRET: stripeWebhookSecret,
} = process.env;

if (!stripeSecretKey || !stripeWebhookSecret) {
  throw new Error(
    "You need to provide both STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET to handle stripe webhooks"
  );
}
const stripe = new Stripe(stripeSecretKey, {
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
  status,
}: {
  workspaceSlug: string;
  workspacePlan: WorkspacePlan;
  status: WorkspaceStatus;
}) => {
  const prisma = await getPrismaClient();
  await prisma.workspace.update({
    where: { slug: workspaceSlug },
    data: { plan: workspacePlan, status },
  });
};

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        buf,
        sig as string,
        stripeWebhookSecret
      );
    } catch (err: any) {
      return res.status(400).send(`Webhook Error: ${err.message!}`);
    }

    if (relevantEvents.has(event.type)) {
      try {
        const {
          customer,
          status: statusStr,
          items,
        } = event.data.object as Stripe.Subscription;

        const prisma = await getPrismaClient();
        const workspaceSlug = (
          await prisma.workspace.findFirst({
            where: { stripeCustomerId: customer as string },
            select: { slug: true },
          })
        )?.slug;

        if (!workspaceSlug) {
          throw new Error("No workspace found for this subscription");
        }

        const status = toEnumValue(WorkspaceStatus, pascalCase(statusStr));
        switch (event.type) {
          case "customer.subscription.created":
          case "customer.subscription.updated":
            switch (status) {
              case "Active":
              case "Incomplete":
              case "Trialing": {
                const { product } = items.data[0].price;
                const { name: productName } = await stripe.products.retrieve(
                  typeof product === "string" ? product : product.id
                );
                await updateWorkspacePlan({
                  workspacePlan: toEnumValue(WorkspacePlan, productName),
                  workspaceSlug,
                  status,
                });
                break;
              }
              case "Canceled":
              case "IncompleteExpired":
              case "Unpaid":
              case "PastDue": {
                await updateWorkspacePlan({
                  workspacePlan: WorkspacePlan.Community,
                  workspaceSlug,
                  status,
                });
                break;
              }
              default:
                throw new Error(`Unknown status ${statusStr}`);
            }
            break;
          case "customer.subscription.deleted": {
            await updateWorkspacePlan({
              workspaceSlug,
              workspacePlan: WorkspacePlan.Community,
              status,
            });
            break;
          }
          default:
            throw new Error("Unknown event type");
        }
      } catch (error) {
        console.error(error);
        return res
          .status(400)
          .send('Webhook error: "Webhook handler failed. View logs."');
      }
    }

    return res.json({ received: true });
  }
  res.setHeader("Allow", "POST");
  return res.status(405).end("Method Not Allowed");
};

export default webhookHandler;
