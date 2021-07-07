import { db } from "../../typescript/web-app/src/connectors/database";

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
