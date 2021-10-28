import { PrismaClient as PrismaClientClass } from "@prisma/client";

declare module globalThis {
  let prismaInstance: PrismaClientClass;
  let prismaInstanceIsConnected: boolean;
}

export type PrismaClient = PrismaClientClass;

export const createPrismaClient = () => {
  const areTestsRunning =
    process.env.RUNNING_TESTS === "true" ||
    process.env.JEST_WORKER_ID !== undefined;
  const url = areTestsRunning // Connect to the test DB if we are running tests
    ? process.env.POSTGRES_TEST_URL
    : process.env.POSTGRES_EXTERNAL_URL;
  console.log("Will create prisma instance in URL", url);
  return new PrismaClientClass({
    datasources: { db: { url } },
  });
};

export const resetPrismaClient = async (): Promise<PrismaClientClass> => {
  console.log("[Prisma Client] Initializing prismaInstance");
  if (globalThis.prismaInstance) {
    try {
      globalThis.prismaInstance.$disconnect();
    } catch (error) {
      console.warn(
        "[Prisma Client] Could not close existing prismaInstance",
        error
      );
    }
  }
  globalThis.prismaInstance = createPrismaClient();
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

// export const resetPrismaClient = async (): Promise<PrismaClientClass> => {
//   globalThis.prismaInstance = new PrismaClientClass({
//     datasources: { db: { url: process.env.POSTGRES_EXTERNAL_URL } },
//   });

//   return globalThis.prismaInstance;
// };

// globalThis.prismaInstanceIsConnected = false;

// export const getPrismaClient = async (): Promise<PrismaClientClass> => {
//   if (globalThis.prismaInstance) {
//     return globalThis.prismaInstance;
//   }

//   return await resetPrismaClient();
// };
