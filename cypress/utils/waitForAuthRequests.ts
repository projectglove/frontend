export const waitForAuthRequest = (timeout = 10000) =>
  cy.waitUntil(
    () =>
      cy.getTxRequests().then((req) => {
        console.log('req', req);
        return Object.entries(req).length > 0;
      }),
    {
      timeout
    }
  );