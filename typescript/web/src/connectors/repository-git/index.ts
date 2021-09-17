import { DbDataset, Repository } from "@labelflow/common-resolvers";
import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,
  userAgent: "LabelFlow v0.0.1",
});

export const repository: Repository = {
  image: {
    add: async (image) => {
      throw new Error("Not implemented");
    },
    count: async (where) => {
      throw new Error("Not implemented");
    },
    getById: async (id) => {
      throw new Error("Not implemented");
    },
    list: async (id) => {
      throw new Error("Not implemented");
    },
  },
  label: {
    add: async (label) => {
      throw new Error("Not implemented");
    },
    count: async (label) => {
      throw new Error("Not implemented");
    },
    delete: async (id) => {
      throw new Error("Not implemented");
    },
    getById: async (id) => {
      throw new Error("Not implemented");
    },
    list: async (id) => {
      throw new Error("Not implemented");
    },
    update: async (id, changes) => {
      throw new Error("Not implemented");
    },
  },
  labelClass: {
    add: async (labelClass) => {
      throw new Error("Not implemented");
    },
    count: async (where?) => {
      throw new Error("Not implemented");
    },
    delete: async (id: string) => {
      throw new Error("Not implemented");
    },
    getById: async (id) => {
      throw new Error("Not implemented");
    },
    list: async (id) => {
      throw new Error("Not implemented");
    },
    update: async (id, changes) => {
      throw new Error("Not implemented");
    },
  },
  dataset: {
    add: async (dataset) => {
      throw new Error("Not implemented");
    },
    delete: async (id) => {
      throw new Error("Not implemented");
    },
    getById: async (id) => {
      throw new Error("Not implemented");
    },
    getByName: async (name) => {
      throw new Error("Not implemented");
    },
    getBySlug: async (slug) => {
      const { data: repo } = await octokit.rest.repos.get({
        owner: "crubier",
        repo: `labelflow-dataset-${slug}`,
      });
      return {
        createdAt: repo.created_at,
        updatedAt: repo.updated_at,
        id: `${repo.id}`,
        name: repo.name.replace(/^labelflow-dataset-/, ""),
        slug: repo.name.replace(/^labelflow-dataset-/, ""),
      };
    },
    list: async () => {
      const repos = await octokit.rest.search.repos({
        q: "labelflow-dataset-",
        sort: "stars",
        order: "desc",
        per_page: 100,
      });

      const results = repos.data.items
        .filter((repo) => repo.name.startsWith("labelflow-dataset-"))
        .map(
          (repo): DbDataset => ({
            createdAt: repo.created_at,
            updatedAt: repo.updated_at,
            id: `${repo.id}`,
            name: repo.name.replace(/^labelflow-dataset-/, ""),
            slug: repo.name.replace(/^labelflow-dataset-/, ""),
          })
        );

      return results;
    },
    update: async (id, changes) => {
      throw new Error("Not implemented");
    },
  },
  upload: {
    // For LFS support, see https://github.com/isomorphic-git/isomorphic-git/issues/1375
    getUploadTarget: async (id) => {
      throw new Error("Not implemented");
    },
    getUploadTargetHttp: async (id) => {
      throw new Error("Not implemented");
    },
    put: async (id) => {
      throw new Error("Not implemented");
    },
    get: async (id) => {
      throw new Error("Not implemented");
    },
    delete: async (id) => {
      throw new Error("Not implemented");
    },
  },
};
