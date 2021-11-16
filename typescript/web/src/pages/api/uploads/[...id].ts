import { createClient } from "@supabase/supabase-js";
import nextConnect from "next-connect";
import multer from "multer";
import { getSession } from "next-auth/react";
import { NextApiResponse, NextApiRequest } from "next";
import { captureException } from "@sentry/nextjs";

const client = createClient(
  process?.env?.SUPABASE_API_URL as string,
  process?.env?.SUPABASE_API_KEY as string
);
const bucket = "labelflow-images";
const upload = multer();

const apiRoute = nextConnect({
  onError(error, req: NextApiRequest, res: NextApiResponse) {
    res
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message}` });
    captureException(error);
  },
  onNoMatch(req: NextApiRequest, res: NextApiResponse) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    captureException(new Error(`Method '${req.method}' Not Allowed`));
  },
});

apiRoute.use(upload.single("image"));

apiRoute.put(async (req, res) => {
  const session = await getSession({ req });
  // Block all queries by unauthenticated users
  if (typeof session?.user.id !== "string") {
    return res.status(401).json({
      error: {
        name: "Unauthorized",
        message: "User must be signed in to upload files.",
      },
    });
  }
  const key = (req.query.id as string[]).join("/");
  // @ts-ignore
  const { file } = req;
  const { error } = await client.storage.from(bucket).upload(key, file.buffer, {
    contentType: file.mimetype,
    upsert: false,
    cacheControl: "public, max-age=31536000, immutable",
  });
  if (error) {
    return res
      .status(404)
      .json({ error: { name: error.name, message: error.message } });
  }
  return res.status(200).json({ data: "success" });
});

apiRoute.get(async (req, res) => {
  const session = await getSession({ req });
  // Block all queries by unauthenticated users
  if (typeof session?.user.id !== "string") {
    return res.status(401).json({
      error: {
        name: "Unauthorized",
        message: "User must be signed in to download files.",
      },
    });
  }
  const key = (req.query.id as string[]).join("/");

  const { signedURL, error } = await client.storage
    .from(bucket)
    .createSignedUrl(key, 3600);

  if (error) {
    return res
      .status(404)
      .json({ error: { name: error.name, message: error.message } });
  }
  if (signedURL) {
    return res.redirect(302, signedURL);
  }

  return res.status(404).json({ error: { name: "Unknown error" } });
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
