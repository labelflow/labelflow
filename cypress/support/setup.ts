/* eslint-disable no-console */
import { getDatabase } from "../../typescript/web/src/connectors/database";

// From https://github.com/cypress-io/cypress/issues/702#issuecomment-435873135
beforeEach(() =>
  cy.window().then(async (window) => {
    try {
      console.log(
        "Start resetting everything before each test ============================================================================"
      );

      console.log("Clear cookies");
      cy.clearCookies();

      console.log("Clear database");
      await Promise.all(getDatabase().tables.map((table) => table.clear()));

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
      console.log(
        "Finish resetting everything before each test ==========================================================================="
      );
    }
  })
);

// From https://github.com/cypress-io/cypress/issues/702#issuecomment-435873135
afterEach(() =>
  cy.window().then(async (window) => {
    try {
      console.log(
        "Start resetting everything after each test ============================================================================"
      );

      console.log("Clear cookies");
      cy.clearCookies();

      console.log("Clear database");
      await Promise.all(getDatabase().tables.map((table) => table.clear()));

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
      console.log(
        "Finish resetting everything after each test ==========================================================================="
      );
    }
  })
);

// From https://github.com/cypress-io/cypress/issues/702#issuecomment-435873135
after(() =>
  cy.window().then(async (window) => {
    try {
      console.log(
        "Start resetting everything after all tests ============================================================================"
      );
      console.log("Unregister service workers");
      const registrations =
        await window.navigator.serviceWorker.getRegistrations();
      if (registrations.length <= 0) {
        console.error("No service worker registered, this is not normal");
      }
      await Promise.all(
        registrations.map((registration) => {
          console.log("Unregistering", registration);
          return registration.unregister();
        })
      );
    } catch (error) {
      console.error(error);
    } finally {
      console.log(
        "Finish resetting everything after all tests ==========================================================================="
      );
    }
  })
);
