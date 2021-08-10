import { createClient } from "@supabase/supabase-js";
import { NextApiResponse, NextApiRequest } from "next";

const client = createClient(
  process?.env?.SUPABASE_API_URL as string,
  process?.env?.SUPABASE_API_KEY as string
);
const bucket = "labelflow-images";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const file = req.body;
  const key = (req.query.id as string[]).join("/");
  console.log(`
  key = ${key}
  type of body = ${typeof file}
  `);
  if (req.method === "PUT") {
    await client.storage.from(bucket).upload(key, file, {
      // contentType: file.type,
      contentType: "image/jpeg",
      upsert: false,
      cacheControl: "public, max-age=31536000, immutable",
    });
    res.status(200).json({});
  } else {
    res.status(404).json({ error: `method ${req.method} unsupported` });
  }
}

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };
