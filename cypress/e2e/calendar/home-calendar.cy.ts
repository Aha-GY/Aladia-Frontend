describe('Check navigation from home to calendar tab', () => {
  context('Desktop Viewport (1200 x 800)', () => {
    let userId; // variable to store the current userId
    beforeEach(() => {
      cy.viewport(1200, 800);

      cy.login(
        Cypress.env('TEST_USER_EMAIL'),
        Cypress.env('TEST_USER_PASSWORD'),
      );
      cy.getUserId().then((id) => {
        userId = id;
      });
      cy.visitDesktop(`/`);
    });
    /* ==== Test Created with Cypress Studio ==== */

    it('Should Desktop Home page is ready with logged-in user and navigate to calendar section', () => {
      // Navigate to Calendar section
      /* ==== Generated with Cypress Studio ==== */
      cy.get(
        '[data-cy="sidebar-space-icon"] > .v-touch-ripple > .flex > .fa-solid',
      ).click();
      cy.get(`a[href*="/user/hub/${userId}/calendar"]`).click();
      /* ==== End Cypress Studio ==== */
      cy.url().should('include', '/calendar');
    });
  });
});
