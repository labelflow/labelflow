import { v4 as uuidV4 } from "uuid";

export const addIdIfNil = <T>(
  input: T & { id?: string | null }
): T & { id: string } => ({
  ...input,
  id: input.id ?? uuidV4(),
});
