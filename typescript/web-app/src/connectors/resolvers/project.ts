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

const getProjectById = async (id: string): Promise<DbProject> => {
  const project = await db.project.get(id);

  if (project === undefined) {
    throw new Error("No project with such id");
  }

  return project;
};

const getProjectByName = async (
  name: string | undefined
): Promise<DbProject> => {
  const project = await db.project.get({ name });
  // const project = await db.project.where({ name }).first();

  if (project === undefined) {
    // console.log("project", project);
    // console.log("list from dexie");
    // console.log(await db.project.toArray());

    throw new Error(`No project with name "${name}"`);
  }

  return project;
};

const getProjectFromWhereUniqueInput = async (
  where: ProjectWhereUniqueInput
): Promise<DbProject> => {
  const { id, name } = where;

  if (id != null) return getProjectById(id);

  if (name != null) return getProjectByName(name);

  throw new Error("Invalid where unique input for project entity");
};

// Queries
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
};
