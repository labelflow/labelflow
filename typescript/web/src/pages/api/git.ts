import nextConnect from "next-connect";

import { NextApiResponse, NextApiRequest } from "next";
import corsProxy from "@isomorphic-git/cors-proxy/middleware";

import { captureException } from "@sentry/nextjs";

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

const options = {};

apiRoute.use(corsProxy(options));

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
