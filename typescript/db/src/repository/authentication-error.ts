export class AuthenticationError extends Error {
  constructor() {
    // https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html#support-for-newtarget
    super("User not authenticated"); // 'Error' breaks prototype chain here
    Object.setPrototypeOf(this, new.target.prototype); // Restore prototype chain
  }
}
