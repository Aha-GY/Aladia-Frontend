describe('Login User with Email', () => {
  context('Desktop Viewport (1200 x 800)', () => {
    beforeEach(() => {
      cy.viewport(1200, 800);
      cy.visitDesktop('/');
    });

    it('Log in a user with email and check if the name is correct', () => {
      /* ==== Generated with Cypress Studio ==== */
      cy.get('[data-cy="join-now-button"]').click();
      cy.get('[data-cy="login-email-text-field"]').clear();
      cy.get('[data-cy="login-email-text-field"]').type(
        Cypress.env('TEST_USER_EMAIL'),
      );
      cy.get('[data-cy="login-submit-button"]').click();
      cy.get('[data-cy="login-password-text-field"]').clear();
      cy.get('[data-cy="login-password-text-field"]').type(
        Cypress.env('TEST_USER_PASSWORD'),
      );
      cy.get('[data-cy="login-submit-button"]').click();
      cy.get('[data-cy="header-avatar"]').click();
      cy.get('[data-cy="name-profile-text"]').should('have.text', 'test ci-cd');
      /* ==== End Cypress Studio ==== */
    });
  });
});
