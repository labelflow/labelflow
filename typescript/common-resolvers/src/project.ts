import { trim } from "lodash/fp";
import { v4 as uuidv4 } from "uuid";
import type {
  MutationCreateProjectArgs,
  MutationDeleteProjectArgs,
  MutationUpdateProjectArgs,
  ProjectWhereUniqueInput,
  QueryProjectArgs,
  QueryProjectsArgs,
  QueryImagesArgs,
} from "../../web-app/src/graphql-types.generated";
import { DbProject } from "../../web-app/src/connectors/database";
import { Repository } from "../../web-app/src/connectors/repository"

import { Context } from "./types";
import { throwIfResolvesToNil } from "./utils/throw-if-resolves-to-nil";

export const projectTypename = "Project";

const getProjectById = async (
  id: string,
  repository: Repository
): Promise<DbProject> => {
  const project = await throwIfResolvesToNil(
    "No project with such id",
    repository.project.getById
  )(id);

  return { ...project, __typename: projectTypename };
};

const getProjectByName = async (
  name: string,
  repository: Repository
): Promise<DbProject> => {
  const project = await throwIfResolvesToNil(
    `No project with name "${name}"`,
    repository.project.getByName
  )(name);

  return { ...project, __typename: projectTypename };
};

const getProjectFromWhereUniqueInput = async (
  where: ProjectWhereUniqueInput,
  repository: Repository
): Promise<DbProject> => {
  const { id, name } = where;

  if (id != null) return getProjectById(id, repository);

  if (name != null) return getProjectByName(name, repository);

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
    __typename: projectTypename,
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
    });
    return await getProjectById(projectId, repository);
  } catch (e) {
    throw new Error("Could not create the project");
  }
};

const updateProject = async (
  _: any,
  args: MutationUpdateProjectArgs,
  { repository }: Context
): Promise<DbProject> => {
  const projectToUpdate = await getProjectFromWhereUniqueInput(
    args.where,
    repository
  );

  const updateResult = await repository.project.update(
    projectToUpdate.id,
    args.data
  );
  if (updateResult === 0) {
    throw new Error("Could not update the project");
  }

  return getProjectById(projectToUpdate.id, repository);
};

const deleteProject = async (
  _: any,
  args: MutationDeleteProjectArgs,
  { repository }: Context
) => {
  const projectToDelete = await getProjectFromWhereUniqueInput(
    args.where,
    repository
  );

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
    updateProject,
    deleteProject,
  },

  Project: {
    images,
    labels,
    labelClasses,
  },
};
