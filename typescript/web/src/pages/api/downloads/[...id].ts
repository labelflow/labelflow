import nextConnect from "next-connect";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
// import multer from "multer";
import { getSession } from "next-auth/react";
import { NextApiResponse, NextApiRequest } from "next";
import { captureException } from "@sentry/nextjs";

const client = new S3Client({
  region: process.env?.AWS_REGION,
  credentials: {
    accessKeyId: process.env?.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env?.AWS_SECRET_ACCESS_KEY!,
  },
});
const bucket = "labelflow-images";
// const upload = multer();

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

// apiRoute.use(upload.single("image"));

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

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  try {
    const signedURL = await getSignedUrl(client, command, { expiresIn: 3600 });
    if (signedURL) {
      return res.redirect(302, signedURL);
    }
    return res.status(404).json({ error: { name: "Unknown error" } });
  } catch (error) {
    return res
      .status(404)
      .json({ error: { name: error.name, message: error.message } });
  }
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
