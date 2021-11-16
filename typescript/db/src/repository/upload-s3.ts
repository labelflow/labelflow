// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import "isomorphic-fetch";

// import { Repository } from "../../../common-resolvers/src";
// import { UploadTargetHttp } from "../../../graphql-types/src/graphql-types.generated";

// const bucket = "labelflow-images";
// const region = "eu-west-1";
// const location = `https://${bucket}.s3.${region}.amazonaws.com`;
// const s3Client = new S3Client({
//   region,
//   credentials: {
//     accessKeyId: process.env?.LABELFLOW_AWS_ACCESS_KEY_ID!,
//     secretAccessKey: process.env?.LABELFLOW_AWS_SECRET_ACCESS_KEY!,
//   },
// });

// export const getUploadTargetHttp = async (
//   key: string
// ): Promise<UploadTargetHttp> => {
//   const command = new PutObjectCommand({
//     Bucket: bucket,
//     Key: key,
//   });
//   const signedUrl = await getSignedUrl(s3Client, command, {
//     expiresIn: 3600,
//   });
//   return {
//     __typename: "UploadTargetHttp",
//     uploadUrl: signedUrl,
//     downloadUrl: `${location}/${key}`,
//   };
// };

// export const getFromStorage: Repository["upload"]["get"] = async (url, req) => {
//   const headers = new Headers();
//   headers.set("Accept", "image/tiff,image/jpeg,image/png,image/*,*/*;q=0.8");
//   headers.set("Sec-Fetch-Dest", "image");
//   if ((req?.headers as any)?.cookie) {
//     headers.set("Cookie", (req?.headers as any)?.cookie);
//   }

//   const fetchResult = await fetch(url, {
//     method: "GET",
//     headers,
//   });

//   if (fetchResult.status !== 200) {
//     throw new Error(
//       `Getting from S3 storage, could not fetch image at url ${url} properly, code ${fetchResult.status}`
//     );
//   }
//   return await fetchResult.arrayBuffer();
// };

// export const putInStorage: Repository["upload"]["put"] = async (url, blob) => {
//   await fetch(url, {
//     method: "PUT",
//     body: await blob.arrayBuffer(),
//   });
// };

export const a = {};
