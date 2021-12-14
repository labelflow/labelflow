// Script added to copy the contents of one supabase storage bucket to another bucket in a different project
// Added in the context of creating a new Supabase project for production in https://github.com/labelflow/labelflow/issues/621

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import Bluebird from "bluebird";

const prompt = require("prompt");

prompt.message = "Warning:";

const requiredEnvVars = [
  "BUCKET",
  "FROM_SUPABASE_API_URL",
  "FROM_SUPABASE_API_KEY",
  "TO_SUPABASE_API_URL",
  "TO_SUPABASE_API_KEY",
];

const queryLimit = 10000;

const listFilesFromClient = async (client: SupabaseClient, bucket: string) => {
  const { data, error } = await client.storage
    .from(bucket)
    .list("", { limit: queryLimit });

  if (error) {
    throw new Error(
      `Could not fetch from ${process.env.FROM_SUPABASE_API_URL}:\n${error}`
    );
  }

  if (data == null) {
    throw new Error("Bucket is empty");
  }

  if (data.length === queryLimit) {
    throw new Error(
      `Reached query limit of ${queryLimit}, please increase it manually in the code.`
    );
  }
  return data;
};

const duplicateBucket = async () => {
  try {
    const checkEnvVars = () => {
      requiredEnvVars.forEach((envVar) => {
        if (!process.env[envVar]) {
          throw new Error(
            `Missing required env var ${envVar}.\n Make sure all env vars are set in a .env file at the root of the scripts folder.\n Required env vars are: ${requiredEnvVars.join(
              ", "
            )}\n`
          );
        }
      });
    };

    checkEnvVars();
    const fromClient = createClient(
      process.env.FROM_SUPABASE_API_URL as string,
      process.env.FROM_SUPABASE_API_KEY as string
    );
    const toClient = createClient(
      process.env.TO_SUPABASE_API_URL as string,
      process.env.TO_SUPABASE_API_KEY as string
    );
    const bucket = process.env.BUCKET as string;

    const fromData = await listFilesFromClient(fromClient, bucket);
    const toData = await listFilesFromClient(toClient, bucket);
    const filteredData = fromData.filter(
      (file) => !toData.some((toFile) => file.name === toFile.name)
    );
    const { name: userAnswer } = await prompt.get({
      properties: {
        name: {
          description: `Found the following files:\n${filteredData
            .map((file) => file.name)
            .join("\n")}\n\n ${filteredData.length} files will be copied from ${
            process.env.FROM_SUPABASE_API_URL
          } to ${
            process.env.TO_SUPABASE_API_URL
          } do you agree to continue? (y/n)`,
        },
      },
    });
    if (userAnswer === "y") {
      await Bluebird.map(
        filteredData,
        async (file) => {
          const fileName = file.name;
          const { data: fileData, error: downloadError } =
            await fromClient.storage.from(bucket).download(fileName);

          if (fileData == null) {
            throw new Error(
              `Could not download file ${fileName}:\n ${
                downloadError != null ? downloadError : "Unkonwn erorr"
              }`
            );
          }
          const { error: uploadError } = await toClient.storage
            .from(bucket)
            .upload(fileName, fileData, {
              contentType: fileData.type,
              cacheControl: "3600",
              upsert: true,
            });
          if (uploadError) {
            throw new Error(`${JSON.stringify(uploadError)}`);
          }
        },
        { concurrency: 10 }
      );
      console.log(
        `\n Successfully copied all elements to ${process.env.TO_SUPABASE_API_URL}`
      );
    }
  } catch (error) {
    console.log(error);
  }
};

duplicateBucket();

export {};
