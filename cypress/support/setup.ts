// From https://github.com/cypress-io/cypress/issues/702#issuecomment-435873135
beforeEach(() => {
  cy.window().then(async (window) => {
    console.log("Start resetting everything before each test");
    console.log("Clear caches");
    try {
      const cacheNames = await window.caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => {
          return window.caches.delete(cacheName);
        })
      );
      // @ts-ignore
      // eslint-disable-next-line no-param-reassign
      window.cacheCleared = true; // This is needed to ensure that the cy.window() command and the next cy commands do not interfere
      console.log("Cleared caches");
    } catch (error) {
      console.error(error);
    }
    cy.window().should("have.property", "cacheCleared", true);
    console.log("Clear cookies and online DB");
    cy.clearCookies();
    cy.task("clearDb").then(() =>
      console.log("Finish resetting everything before each test")
    );
  });
});

// From https://github.com/cypress-io/cypress/issues/702#issuecomment-435873135
afterEach(() =>
  cy.window().then(async (window) => {
    try {
      console.log("Start resetting everything after each test");

      console.log("Clear cookies");
      cy.clearCookies();

      console.log("Clear caches");
      const cacheNames = await window.caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => {
          return window.caches.delete(cacheName);
        })
      );
    } catch (error) {
      console.error(error);
    } finally {
      console.log("Finish resetting everything after each test");
    }
  })
);
