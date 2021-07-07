import { db } from "../../typescript/web-app/src/connectors/database";

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
beforeEach(() =>
  cy.window().then(async () => {
    // Unregister service workers
    console.log("Unregister service workers");
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(
      registrations.map((registration) => registration.unregister())
    );

    // Clear caches
    console.log("Clear caches");
    const cacheNames = await window.caches.keys();
    await Promise.all(
      cacheNames.map(function (cacheName) {
        return window.caches.delete(cacheName);
      })
    );

    // Clear database
    console.log("Clear database");
    await Promise.all([
      db.image.clear(),
      db.label.clear(),
      db.labelClass.clear(),
    ]);
  })
);
