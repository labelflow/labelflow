import { PrismaClient as PrismaClientClass } from "@prisma/client";

declare module globalThis {
  let prismaInstance: PrismaClientClass;
  let prismaInstanceIsConnected: boolean;
}

export type PrismaClient = PrismaClientClass;

export const resetPrismaClient = async (): Promise<PrismaClientClass> => {
  console.log("Initializing prismaInstance");
  if (globalThis.prismaInstance) {
    try {
      globalThis.prismaInstance.$disconnect();
    } catch (error) {
      console.log("Could not close existing prismaInstance", error);
    }
  }
  globalThis.prismaInstance = new PrismaClientClass({
    datasources: { db: { url: process.env.POSTGRES_EXTERNAL_URL } },
  });
  globalThis.prismaInstance.$on("beforeExit", () => {
    globalThis.prismaInstanceIsConnected = false;
  });

  await globalThis.prismaInstance.$connect();
  globalThis.prismaInstanceIsConnected = true;

  return globalThis.prismaInstance;
};

globalThis.prismaInstanceIsConnected = false;

export const getPrismaClient = async (): Promise<PrismaClientClass> => {
  if (globalThis.prismaInstance) {
    if (!globalThis.prismaInstanceIsConnected) {
      await globalThis.prismaInstance.$connect();
    }
    return globalThis.prismaInstance;
  }

  return await resetPrismaClient();
};
