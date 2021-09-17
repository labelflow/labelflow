export const notImplementedInLocalWorkspaceResolver = () => {
  throw new Error(
    "The operation you are trying to execute is not implemented in the local workspace"
  );
};
