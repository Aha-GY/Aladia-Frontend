describe('Check session', () => {
  context('Desktop Viewport (1200 x 800)', () => {
    beforeEach(() => {
      cy.viewport(1200, 800);

      cy.login(
        Cypress.env('TEST_USER_EMAIL'),
        Cypress.env('TEST_USER_PASSWORD'),
      );

      cy.visitDesktop('/');
    });
    it('Desktop Home page is ready with logged in user', () => {
      // Home page with logged in user is available
      // write your Desktop tests herecypress/e2e/home/test-needs-login.cy.ts
    });
  });
  // context('Mobile Viewport (550 x 800)', () => {
  //   beforeEach(() => {
  //     cy.viewport(550, 800);

  //     cy.login(
  //       Cypress.env('TEST_USER_EMAIL'),
  //       Cypress.env('TEST_USER_PASSWORD'),
  //     );

  //     cy.visitMobile('/');
  //   });
  //   it('Mobile Home page is ready with logged in user', () => {
  //     // Home page with logged in user is available
  //     // write your Mobile tests here
  //   });
  // });
});
