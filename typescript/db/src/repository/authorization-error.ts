export class AuthorizationError extends Error {
  constructor(resource: string) {
    const message = `User not authorized to access ${resource}`;
    // https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html#support-for-newtarget
    super(message); // 'Error' breaks prototype chain here
    Object.setPrototypeOf(this, new.target.prototype); // Restore prototype chain
  }
}
