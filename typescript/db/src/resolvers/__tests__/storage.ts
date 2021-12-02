import { S3Client, PutObjectCommand, S3ClientConfig } from "@aws-sdk/client-s3";

// This is a simple crash test for using minio along with s3 sdk. That doesn't work so far.
it.skip("test minio w/ s3 client", async () => {
  const configClient: S3ClientConfig = {
    region: process.env?.LABELFLOW_AWS_REGION,
    credentials: {
      accessKeyId: process.env?.LABELFLOW_AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env?.LABELFLOW_AWS_SECRET_ACCESS_KEY!,
    },
    endpoint: process.env?.LABELFLOW_AWS_ENDPOINT,
    forcePathStyle: true,
  };
  const client = new S3Client(configClient);
  console.log(`
  S3 Client initiated with config: 
  ${JSON.stringify(configClient, null, 1)}
  `);
  const command = new PutObjectCommand({
    Bucket: "testbucket",
    Key: "testObject",
    Body: "hello world!",
  });
  await client.send(command);
});
