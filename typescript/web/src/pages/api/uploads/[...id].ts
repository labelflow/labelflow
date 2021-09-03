import { createClient } from "@supabase/supabase-js";
import nextConnect from "next-connect";
import multer from "multer";
import { getSession } from "next-auth/client";
import { NextApiResponse, NextApiRequest } from "next";

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
  },
  onNoMatch(req: NextApiRequest, res: NextApiResponse) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single("image"));

apiRoute.put(async (req, res) => {
  const session = await getSession({ req });
  // Block all queries by unauthenticated users
  if (typeof session?.user.id !== "string") {
    throw new Error("User must be signed in to upload files.");
  }
  const key = (req.query.id as string[]).join("/");
  // @ts-ignore
  const { file } = req;
  await client.storage.from(bucket).upload(key, file.buffer, {
    contentType: file.mimetype,
    upsert: false,
    cacheControl: "public, max-age=31536000, immutable",
  });
  res.status(200).json({ data: "success" });
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
