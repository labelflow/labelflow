import { trim } from "lodash/fp";
import { v4 as uuidv4 } from "uuid";
import type {
  MutationCreateProjectArgs,
  MutationDeleteProjectArgs,
  MutationUpdateProjectArgs,
  ProjectWhereUniqueInput,
  QueryProjectArgs,
  QueryProjectsArgs,
} from "../../graphql-types.generated";
import { db, DbProject } from "../database";

export const projectTypename = "Project";

const getProjectById = async (id: string): Promise<DbProject> => {
  const project = await db.project.get(id);

  if (project === undefined) {
    throw new Error("No project with such id");
  }

  return { ...project, __typename: projectTypename };
};

const getProjectByName = async (
  name: string | undefined
): Promise<DbProject> => {
  const project = await db.project.get({ name });

  if (project === undefined) {
    throw new Error("No project with such name");
  }

  return { ...project, __typename: projectTypename };
};

const getProjectFromWhereUniqueInput = async (
  where: ProjectWhereUniqueInput
): Promise<DbProject> => {
  const { id, name } = where;

  if (id != null) return getProjectById(id);

  if (name != null) return getProjectByName(name);

  throw new Error("Invalid where unique input for project entity");
};

const getImagesByProjectId = async (projectId: string) => {
  const getResults = await db.image.where({ projectId }).sortBy("createdAt");

  return getResults ?? [];
};

const countImagesByProjectId = async (projectId: string) => {
  return db.image.where({ projectId }).count();
};

const getLabelClassesByProjectId = async (projectId: string) => {
  const getResults = await db.labelClass
    .where({ projectId })
    .sortBy("createdAt");

  return getResults ?? [];
};

const countLabelClassesByProjectId = async (projectId: string) => {
  return db.labelClass.where({ projectId }).count();
};

const countLabelsByProjectId = async (projectId: string) => {
  // Labels can only exists if they are linked to an image
  const imagesOfProject = await getImagesByProjectId(projectId);

  return db.label
    .filter((label) =>
      imagesOfProject.some((image) => label.imageId === image.id)
    )
    .count();
};

// Queries
const imagesResolver = async ({ id }: DbProject) => {
  return getImagesByProjectId(id);
};

const imagesCountResolver = async ({ id }: DbProject) => {
  return countImagesByProjectId(id);
};

const labelClassesResolver = async ({ id }: DbProject) => {
  return getLabelClassesByProjectId(id);
};

const labelClassesCountResolver = async ({ id }: DbProject) => {
  return countLabelClassesByProjectId(id);
};

const labelsCountResolver = async ({ id }: DbProject) => {
  return countLabelsByProjectId(id);
};

const project = async (_: any, args: QueryProjectArgs): Promise<DbProject> => {
  return getProjectFromWhereUniqueInput(args.where);
};

const projects = async (
  _: any,
  args: QueryProjectsArgs
): Promise<DbProject[]> => {
  const query = db.project.orderBy("createdAt").offset(args?.skip ?? 0);

  if (args?.first) {
    return query.limit(args.first).toArray();
  }

  return query.toArray();
};

// Mutations
const createProject = async (
  _: any,
  args: MutationCreateProjectArgs
): Promise<DbProject> => {
  const date = new Date().toISOString();

  const projectId = args?.data?.id ?? uuidv4();
  const name = trim(args?.data?.name);

  if (name === "") {
    throw new Error("Could not create the project with an empty name");
  }

  try {
    await db.project.add({
      id: projectId,
      createdAt: date,
      updatedAt: date,
      name,
    });
    return await getProjectById(projectId);
  } catch (e) {
    throw new Error("Could not create the project");
  }
};

const updateProject = async (
  _: any,
  args: MutationUpdateProjectArgs
): Promise<DbProject> => {
  const projectToUpdate = await getProjectFromWhereUniqueInput(args.where);

  await db.project.update(projectToUpdate, args.data);

  return getProjectById(projectToUpdate.id);
};

const deleteProject = async (_: any, args: MutationDeleteProjectArgs) => {
  const projectToDelete = await getProjectFromWhereUniqueInput(args.where);

  await db.project.delete(projectToDelete.id);

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
    images: imagesResolver,
    imagesCount: imagesCountResolver,
    labelClasses: labelClassesResolver,
    labelClassesCount: labelClassesCountResolver,
    labelsCount: labelsCountResolver,
  },
};
