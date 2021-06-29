import { v4 as uuidv4 } from "uuid";
import type {
  MutationCreateProjectArgs,
  MutationDeleteProjectArgs,
  MutationUpdateProjectArgs,
  QueryProjectArgs,
  QueryProjectsArgs,
} from "../../graphql-types.generated";
import { db, DbProject } from "../database";

const getProjectById = async (id: string): Promise<DbProject> => {
  const project = await db.project.get(id);

  if (project === undefined) {
    throw new Error("No project with such id");
  }

  return project;
};

const getOneProjectByName = async (name: string): Promise<DbProject> => {
  const project = await db.project.where({ name }).toArray();

  if (project.length === 0) {
    throw new Error("No project with such name");
  }

  return project[0];
};

// Queries
const project = (_: any, args: QueryProjectArgs): Promise<DbProject> => {
  const { id, name } = args?.where;

  if (id != null) {
    return getProjectById(id);
  }

  if (name != null) {
    return getOneProjectByName(name);
  }

  throw new Error(
    "You need to specify the ID or the name of the project to find it."
  );
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
  const { id, name } = args.data;
  const date = new Date().toISOString();
  const projectId = id ?? uuidv4();

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
  await db.project.update(args.where.id, args.data);

  return getProjectById(args.where.id);
};

const deleteProject = async (_: any, args: MutationDeleteProjectArgs) => {
  const projectToDelete = await getProjectById(args.where.id);

  await db.project.delete(args.where.id);

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
};
