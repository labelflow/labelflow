export const removeUserFromWhere = <Where>(
  whereWithUser: (Where & { user?: { id: string } }) | undefined | null
): Where | null | undefined => {
  if (whereWithUser == null) {
    return whereWithUser;
  }
  const { user, ...wherePossiblyEmpty } = whereWithUser;
  return Object.keys(wherePossiblyEmpty).length < 1
    ? null
    : (wherePossiblyEmpty as Where);
};
