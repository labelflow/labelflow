/** True is NODE_ENV is production, false otherwise */
export const PRODUCTION = process.env.NODE_ENV === "production";

/** Name of the JWT secret environment variable */
export const JWT_SECRET_ENV = "JWT_SECRET";
