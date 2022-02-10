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

import webpackPreprocessor from "@cypress/webpack-preprocessor";
// See https://www.npmjs.com/package/node-polyfill-webpack-plugin
import NodePolyfillPlugin from "node-polyfill-webpack-plugin";
import path from "path";
import { Configuration } from "webpack";
import { getPrismaClient } from "../../typescript/db/src/prisma-client";
import { MembershipRole } from "../../typescript/graphql-types";
import {
  DATASET_NAME,
  DATASET_SLUG,
  WORKSPACE_NAME,
  WORKSPACE_SLUG,
} from "../fixtures";
import { createJwt } from "../utils/jwt";

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
      await prisma.label.deleteMany({});
      await prisma.labelClass.deleteMany({});
      await prisma.image.deleteMany({});
      await prisma.dataset.deleteMany({});
      await prisma.membership.deleteMany({});
      await prisma.workspace.deleteMany({});
      await prisma.session.deleteMany({});
      await prisma.user.deleteMany({});
      return null;
    },

    async performLogin({
      email = testUser.email,
      name = testUser.name,
    }: { email?: string; name?: string } = {}) {
      const prisma = await getPrismaClient();
      const user = await prisma.user.create({ data: { name, email } });
      return await createJwt(user);
    },

    async createWorkspace() {
      const prisma = await getPrismaClient();
      const workspaceSlug = (
        await prisma.workspace.create({
          data: {
            slug: WORKSPACE_SLUG,
            name: WORKSPACE_NAME,
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
      return { workspaceSlug };
    },

    async createWorkspaceAndDatasets() {
      const prisma = await getPrismaClient();
      await prisma.workspace.create({
        data: {
          slug: WORKSPACE_SLUG,
          name: WORKSPACE_NAME,
          plan: "Community",
          memberships: {
            create: {
              user: { connect: { email: testUser.email } },
              role: "Owner",
            },
          },
        },
      });
      const datasetId = (
        await prisma.dataset.create({
          data: {
            workspace: { connect: { slug: WORKSPACE_SLUG } },
            slug: DATASET_SLUG,
            name: DATASET_NAME,
          },
        })
      ).id;
      return { datasetId };
    },

    async inviteUser({ workspaceSlug }: { workspaceSlug?: string } = {}) {
      const prisma = await getPrismaClient();

      const actualWorkspaceSlug = workspaceSlug ?? WORKSPACE_SLUG;
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
