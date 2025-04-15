describe('Check session', () => {
  context('Desktop Viewport (1200 x 800)', () => {
    beforeEach(() => {
      cy.viewport(1200, 800);

      cy.login(
        Cypress.env('TEST_USER_EMAIL'),
        Cypress.env('TEST_USER_PASSWORD'),
      );
      cy.getUserId().then((id) => {
        // This runs after `cy.getUserId()` completes and `id` is available
        // cy.log(`User ID: ${id}`);

        // Additional Cypress commands here will run sequentially
        cy.visitDesktop(`/user/hub/${id}`);
      });
    });
    it('Desktop Home page is ready with logged in user', () => {
      // Home page with logged in user is available
      // write your Desktop tests herecypress/e2e/home/test-needs-login.cy.ts
    });
  });
  //   context('Mobile Viewport (550 x 800)', () => {
  //     beforeEach(() => {
  //       cy.viewport(550, 800);

  //       cy.login(
  //         Cypress.env('TEST_USER_EMAIL'),
  //         Cypress.env('TEST_USER_PASSWORD'),
  //       );

  //       cy.getUserId().then((id) => {
  //         // This runs after `cy.getUserId()` completes and `id` is available
  //         cy.log(`User ID: ${id}`);

  //         // Additional Cypress commands here will run sequentially
  //         cy.visitMobile(`/user/hub/${id}`);
  //       });
  //     });
  //     it('Mobile Home page is ready with logged in user', () => {
  //       // Home page with logged in user is available
  //       // write your Mobile tests here
  //     });
  //   });
});
