import nextConnect from "next-connect";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSession } from "next-auth/react";
import { NextApiResponse, NextApiRequest } from "next";
import { captureException } from "@sentry/nextjs";

let awsS3CustomEndpointOptions = {};
const EXPIRATION_TIME_SEC = 3600;

if (process.env.LABELFLOW_AWS_ENDPOINT) {
  const endpointUrl = new URL(process.env.LABELFLOW_AWS_ENDPOINT);

  awsS3CustomEndpointOptions = {
    endpoint: {
      protocol: endpointUrl.protocol.slice(0, -1), // remove trailing colon
      hostname: endpointUrl.host, // needs to contains the port, so host, not hostname
      path: endpointUrl.pathname, // required, else we have this issue: https://github.com/aws/aws-sdk-js-v3/issues/1941#issuecomment-824194714
    },
    forcePathStyle: true, // required to make minio work
  };
}

const client = new S3Client({
  region: process.env.LABELFLOW_AWS_REGION,
  credentials: {
    accessKeyId: process.env.LABELFLOW_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.LABELFLOW_AWS_SECRET_ACCESS_KEY!,
  },
  // If we set an given endpoint, it means that we test with minio
  // See https://docs.min.io/docs/how-to-use-aws-sdk-for-javascript-with-minio-server.html
  ...awsS3CustomEndpointOptions,
});

const bucket = "labelflow";

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
    const signedURL = await getSignedUrl(client, command, {
      expiresIn: EXPIRATION_TIME_SEC,
    });
    if (signedURL) {
      res.setHeader("cache-control", `private, max-age=${EXPIRATION_TIME_SEC}`);
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
