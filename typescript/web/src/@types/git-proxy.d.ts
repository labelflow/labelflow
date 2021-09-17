declare module "@isomorphic-git/cors-proxy/middleware" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `Provider` React Context
   */
  const corsProxy: (options: {}) => any;
  export default corsProxy;
}
