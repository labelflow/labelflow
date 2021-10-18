import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

import {
  sendInvitationFromPrisma,
  InvitationEmailInputs,
} from "../../../utils/email/send-invitation";

const sendInvitation = sendInvitationFromPrisma(
  new PrismaClient({
    datasources: { db: { url: process.env.POSTGRES_EXTERNAL_URL } },
  })
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req as unknown as {
    query: Omit<
      InvitationEmailInputs,
      "origin" | "providerServer" | "providerFrom"
    >;
  };
  const status = await sendInvitation({
    ...query,
    origin: process.env.NEXTAUTH_URL ?? "",
    providerServer: process.env.EMAIL_SERVER ?? "",
    providerFrom: process.env.EMAIL_FROM ?? "",
  });
  res.status(200).json({ status });
}
