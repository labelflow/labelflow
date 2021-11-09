/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a dataset is opened or re-opened (e.g. due to
// the dataset's config changing)

import { Configuration } from "webpack";
import webpackPreprocessor from "@cypress/webpack-preprocessor";
// See https://www.npmjs.com/package/node-polyfill-webpack-plugin
import NodePolyfillPlugin from "node-polyfill-webpack-plugin";
import path from "path";
import { v4 as uuidV4 } from "uuid";
import { getPrismaClient } from "../../typescript/db/src/prisma-client";
import { MembershipRole } from "../../typescript/graphql-types/src/graphql-types.generated";

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on: (type: string, preprocessor: any) => void) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  const config: Configuration = {
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
          exclude: /node_modules/,
        },
        {
          test: /\.(graphql|gql)$/,
          exclude: /node_modules/,
          loader: "graphql-tag/loader",
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "dist"),
    },
  };

  // See https://github.com/webpack-contrib/css-loader/issues/447#issuecomment-761853289
  // See https://github.com/vercel/next.js/issues/7755#issuecomment-812805708
  config.resolve = {
    ...(config.resolve ?? {}),
    fallback: {
      ...(config.resolve?.fallback ?? {}),
      module: false,
      dgram: false,
      dns: false,
      fs: false,
      http2: false,
      net: false,
      tls: false,
      child_process: false,
    },
  };

  config.plugins = [
    ...(config?.plugins ?? []),
    new NodePolyfillPlugin({
      excludeAliases: ["console"],
    }),
  ];

  on(
    "file:preprocessor",
    webpackPreprocessor({
      webpackOptions: config,
    })
  );
  const testUser = {
    name: "Cypress test user",
    email: "test@labelflow.ai",
  };
  on("task", {
    async clearDb() {
      const prisma = await getPrismaClient();
      await prisma.membership.deleteMany({});
      await prisma.workspace.deleteMany({});
      await prisma.session.deleteMany({});
      await prisma.user.deleteMany({});
      return null;
    },
    async performLogin({
      email,
      name,
    }: { email?: string; name?: string } = {}) {
      const prisma = await getPrismaClient();
      const nameToUse = name ?? testUser.name;
      const emailToUse = email ?? testUser.email;
      const existingUser = await prisma.user.findFirst({
        where: { email: emailToUse },
      });
      const user =
        existingUser != null
          ? existingUser
          : await prisma.user.create({
              data: { name: nameToUse, email: emailToUse },
            });
      const session = await prisma.session.create({
        data: {
          userId: user.id,
          sessionToken: uuidV4(),
          expires: new Date(
            new Date().getTime() + 60 * 60 * 1000
          ).toISOString(),
        },
      });
      return session.sessionToken;
    },
    async createWorkspaceAndDatasets() {
      const prisma = await getPrismaClient();
      const workspaceSlug = (
        await prisma.workspace.create({
          data: {
            slug: "cypress-test-workspace",
            name: "Cypress test workspace",
            plan: "Community",
            memberships: {
              create: {
                user: { connect: { email: testUser.email } },
                role: "Owner",
              },
            },
          },
        })
      ).slug;
      const datasetId = (
        await prisma.dataset.create({
          data: {
            workspace: { connect: { slug: "cypress-test-workspace" } },
            slug: "test-dataset-cypress",
            name: "Test dataset cypress",
          },
        })
      ).id;
      return { workspaceSlug, datasetId };
    },
    async inviteUser({ workspaceSlug }: { workspaceSlug?: string } = {}) {
      const prisma = await getPrismaClient();

      const actualWorkspaceSlug = workspaceSlug ?? "cypress-test-workspace";
      const membershipId = (
        await prisma.membership.create({
          data: {
            workspace: {
              connect: { slug: actualWorkspaceSlug },
            },
            role: MembershipRole.Admin,
            invitationEmailSentTo: testUser.email,
          },
        })
      ).id;

      return {
        membershipId,
        inviteUrl: `/${actualWorkspaceSlug}/accept-invite?membershipId=${membershipId}`,
      };
    },
  });
};
