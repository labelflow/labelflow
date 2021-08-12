import { trim } from "lodash/fp";
import { v4 as uuidv4 } from "uuid";
import slugify from "slugify";
import type {
  MutationCreateProjectArgs,
  MutationDeleteProjectArgs,
  MutationUpdateProjectArgs,
  ProjectWhereUniqueInput,
  QueryProjectArgs,
  QueryProjectsArgs,
  QueryImagesArgs,
} from "@labelflow/graphql-types";

import { Context, DbProject, Repository } from "./types";
import { throwIfResolvesToNil } from "./utils/throw-if-resolves-to-nil";
import { getImageEntityFromMutationArgs } from "./image";

// The demo project images
const demoImageUrls = [
  "https://images.unsplash.com/photo-1579513141590-c597876aefbc?auto=format&fit=crop&w=882&q=80",
  "https://images.unsplash.com/photo-1504710685809-7bb702595f8f?auto=format&fit=crop&w=934&q=80",
  "https://images.unsplash.com/photo-1569579933032-9e16447c50e3?auto=format&fit=crop&w=2100&q=80",
  "https://images.unsplash.com/photo-1595687453172-253f44ed3975?auto=format&fit=crop&w=2100&q=80",
  "https://images.unsplash.com/photo-1574082595167-86d59cefcc3a?auto=format&fit=crop&w=2100&q=80",
];

const getProjectById = async (
  id: string,
  repository: Repository
): Promise<DbProject> => {
  const project = await throwIfResolvesToNil(
    "No project with such id",
    repository.project.getById
  )(id);

  return { ...project, __typename: "Project" };
};

const getProjectByName = async (
  name: string,
  repository: Repository
): Promise<DbProject> => {
  const project = await throwIfResolvesToNil(
    `No project with name "${name}"`,
    repository.project.getByName
  )(name);

  return { ...project, __typename: "Project" };
};

const getProjectBySlug = async (
  slug: string,
  repository: Repository
): Promise<DbProject> => {
  const project = await throwIfResolvesToNil(
    `No project with name "${slug}"`,
    repository.project.getBySlug
  )(slug);

  return { ...project, __typename: "Project" };
};

const getProjectFromWhereUniqueInput = async (
  where: ProjectWhereUniqueInput,
  repository: Repository
): Promise<DbProject> => {
  const { id, name, slug } = where;

  if (id != null) return getProjectById(id, repository);

  if (name != null) return getProjectByName(name, repository);

  if (slug != null) return getProjectBySlug(slug, repository);

  throw new Error("Invalid where unique input for project entity");
};

const getLabelClassesByProjectId = (
  projectId: string,
  repository: Repository
) => {
  return repository.labelClass.list({ projectId });
};

// Queries
const images = (
  project: DbProject,
  args: QueryImagesArgs,
  { repository }: Context
) => {
  return repository.image.list(
    { projectId: project.id },
    args?.skip,
    args?.first
  );
};

const labels = async (
  project: DbProject,
  _args: any,
  { repository }: Context
) => {
  return repository.label.list({ projectId: project.id });
};

const labelClasses = async (
  project: DbProject,
  _args: any,
  { repository }: Context
) => {
  return getLabelClassesByProjectId(project.id, repository);
};

const project = async (
  _: any,
  args: QueryProjectArgs,
  { repository }: Context
): Promise<DbProject> => {
  return getProjectFromWhereUniqueInput(args.where, repository);
};

const projects = async (
  _: any,
  args: QueryProjectsArgs,
  { repository }: Context
): Promise<DbProject[]> => {
  const queryResult = await repository.project.list(
    null,
    args.skip,
    args.first
  );

  return queryResult.map((projectWithoutTypename) => ({
    ...projectWithoutTypename,
    __typename: "Project",
  }));
};

// Mutations
const createProject = async (
  _: any,
  args: MutationCreateProjectArgs,
  { repository }: Context
): Promise<DbProject> => {
  const date = new Date().toISOString();

  const projectId = args?.data?.id ?? uuidv4();
  const name = trim(args?.data?.name);

  if (name === "") {
    throw new Error("Could not create the project with an empty name");
  }

  try {
    await repository.project.add({
      id: projectId,
      createdAt: date,
      updatedAt: date,
      name,
      slug: slugify(name, { lower: true }),
    });

    return await getProjectById(projectId, repository);
  } catch (e) {
    throw new Error("Could not create the project");
  }
};

const createDemoProject = async (
  _: any,
  args: {},
  { repository }: Context
): Promise<DbProject> => {
  const projectId = uuidv4();
  const currentDate = new Date().toISOString();
  try {
    await repository.project.add({
      name: "Demo project",
      slug: "demo-project",
      id: projectId,
      createdAt: currentDate,
      updatedAt: currentDate,
    });
  } catch (error) {
    if (error.name === "ConstraintError") {
      // The demo project already exists, just return it
      return getProjectByName("Demo project", repository);
    }
    throw error;
  }
  await Promise.all(
    demoImageUrls.map(async (url) => {
      const imageEntity = await getImageEntityFromMutationArgs(
        {
          projectId,
          url,
        },
        {
          upload: repository.upload,
        }
      );
      return repository.image.add(imageEntity);
    })
  );

  return getProjectById(projectId, repository);
};

const updateProject = async (
  _: any,
  args: MutationUpdateProjectArgs,
  { repository }: Context
): Promise<DbProject> => {
  const projectToUpdate = await throwIfResolvesToNil(
    "No project with such id",
    repository.project.getById
  )(args.where.id);

  const newData =
    "name" in args.data
      ? { ...args.data, slug: slugify(args.data.name) }
      : args.data;
  try {
    const updateResult = await repository.project.update(
      projectToUpdate.id,
      newData
    );
    if (!updateResult) {
      throw new Error("Could not update the project");
    }
  } catch (e) {
    throw new Error("Could not update the project");
  }

  return getProjectById(projectToUpdate.id, repository);
};

const deleteProject = async (
  _: any,
  args: MutationDeleteProjectArgs,
  { repository }: Context
): Promise<DbProject> => {
  const projectToDelete = await throwIfResolvesToNil(
    "No project with such id",
    repository.project.getById
  )(args.where.id);
  await repository.project.delete(projectToDelete.id);
  return projectToDelete;
};

export default {
  Query: {
    project,
    projects,
  },

  Mutation: {
    createProject,
    createDemoProject,
    updateProject,
    deleteProject,
  },

  Project: {
    images,
    labels,
    labelClasses,
  },
};
