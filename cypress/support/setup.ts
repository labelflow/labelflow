import { db } from "../../typescript/web-app/src/connectors/database";

// From https://github.com/cypress-io/cypress/issues/702#issuecomment-435873135
beforeEach(() =>
  cy.window().then(async () => {
    console.log("Clear database");
    await Promise.all(db.tables.map((table) => table.clear()));
  })
);

// From https://github.com/cypress-io/cypress/issues/702#issuecomment-435873135
after(() =>
  cy.window().then(async (window) => {
    console.log("Clear caches");
    const cacheNames = await window.caches.keys();
    await Promise.all(
      cacheNames.map((cacheName) => {
        return window.caches.delete(cacheName);
      })
    );

    console.log("Unregister service workers");
    const registrations =
      await window.navigator.serviceWorker.getRegistrations();
    await Promise.all(
      registrations.map((registration) => registration.unregister())
    );
  })
);
