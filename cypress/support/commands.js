// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// From https://github.com/cypress-io/cypress/issues/702#issuecomment-435873135
beforeEach(() => {
  // https://github.com/cypress-io/cypress/issues/702
  // run this once before all code
  return window.caches.keys().then(function (cacheNames) {
    return Promise.all(
      cacheNames.map(function (cacheName) {
        return window.caches.delete(cacheName);
      })
    );
  });
});

/* Source: https://glebbahmutov.com/cypress-examples/6.5.0/recipes/form-input-by-label.html#simple-custom-command */
Cypress.Commands.add("getByLabel", (label) => {
  cy.contains("label", label)
    .invoke("attr", "for")
    .then((id) => {
      cy.get("#" + id);
    });
});
