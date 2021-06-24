import { v4 as uuidv4 } from "uuid";
import type { MutationCreateProjectArgs } from "../../graphql-types.generated";
import { db, DbProject } from "../database";

const getProjectById = async (id: string): Promise<DbProject> => {
  const project = await db.project.get(id);

  if (project === undefined) {
    throw new Error("No project with such id");
  }

  return project;
};

// Queries

// Mutations
const createProject = async (
  _: any,
  args: MutationCreateProjectArgs
): Promise<DbProject> => {
  const { id, name } = args.data;
  const date = new Date().toISOString();
  const projectId = id ?? uuidv4();

  await db.project.add({
    id: projectId,
    createdAt: date,
    updatedAt: date,
    name,
  });

  try {
    return await getProjectById(projectId);
  } catch (e) {
    throw new Error("Could not create the project");
  }
};

export default {
  // Query: {

  // },
  Mutation: {
    createProject,
  },
};
