/** True is NODE_ENV is production, false otherwise */
export const PRODUCTION = process.env.NODE_ENV === "production";

/** Name of the JWT secret environment variable */
export const JWT_SECRET_ENV = "JWT_SECRET";

/** AWS region */
export const AWS_S3_REGION_ENV = "LABELFLOW_AWS_REGION";

/** AWS bucket name */
export const AWS_S3_BUCKET_ENV = "AWS_S3_BUCKET";

export const DEFAULT_AWS_S3_BUCKET = "labelflow";

/** AWS S3 endpoint URL */
export const AWS_S3_ENDPOINT_ENV = "LABELFLOW_AWS_ENDPOINT";

/** AWS access-key ID */
export const AWS_ACCESS_KEY_ID_ENV = "LABELFLOW_AWS_ACCESS_KEY_ID";

/** AWS secret access-key */
export const AWS_SECRET_ACCESS_KEY_ENV = "LABELFLOW_AWS_SECRET_ACCESS_KEY";
