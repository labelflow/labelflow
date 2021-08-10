import { createClient } from "@supabase/supabase-js";

const client = createClient(
  process?.env?.SUPABASE_API_URL as string,
  process?.env?.SUPABASE_API_KEY as string
);
const bucket = "labelflow-images";

export default async function handler(req: any, res: any) {
  if (req.method === "PUT") {
    await client.storage.from(bucket).upload(req.query.id.join("/"), req.body, {
      contentType: req.body.type,
      upsert: false,
      cacheControl: "public, max-age=31536000, immutable",
    });
    res.status(200).json({});
  } else {
    res.status(404).json({ error: `method ${req.method} unsupported` });
  }
}
