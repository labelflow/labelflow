import { Request } from "express";
import { DataLoaders } from "../data-loader/data-loaders";

declare global {
  interface ContextUser {
    id: string;
    name?: string;
    image?: string;
    email?: string;
  }

  namespace Express {
    interface User extends ContextUser {}
  }

  interface GraphQlContext {
    req: Request;
    loaders: DataLoaders;
  }
}
