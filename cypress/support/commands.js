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
  // if (window.navigator && navigator.serviceWorker) {
  //   console.log("resetting service worker in cypress")
  //   navigator.serviceWorker.getRegistrations().then((registrations) => {
  //     console.log("registrations")
  //     console.log(registrations)
  //     return Promise.all(
  //       registrations.map((registration) => {
  //         return registration.unregister();
  //       }));
  //   }).then(() => {
  //     return navigator.serviceWorker.getRegistrations()
  //   }).then((registrations) => {
  //     console.log("registrations")
  //     console.log(registrations)
  //     // window.location.reload();
  //     // https://github.com/cypress-io/cypress/issues/702
  //     return window.caches.keys()
  //   }).then((cacheNames) => {
  //     return Promise.all(
  //       cacheNames.map((cacheName) => {
  //         return window.caches.delete(cacheName);
  //       })
  //     );
  //   });
  // }


  // run this once before all code
  return window.caches.keys().then(function (cacheNames) {
    return Promise.all(
      cacheNames.map(function (cacheName) {
        return window.caches.delete(cacheName);
      })
    );
  })
});