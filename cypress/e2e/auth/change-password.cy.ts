describe('Change Password', () => {
  context('Desktop Viewport (1200 x 800)', () => {
    let email: string;
    let password: string;
    beforeEach(() => {
      cy.viewport(1200, 800);

      cy.registerUserAndVerifyEmail().then(
        (creds: { email: string; password: string }) => {
          email = creds.email;
          password = creds.password;
          cy.login(email, password);
          cy.visitDesktop('/');
        },
      );
    });

    afterEach(() => {
      if (email) {
        cy.request({
          method: 'DELETE',
          url: `${Cypress.env('apiBaseUrl')}/auth/users`,
        });
      }
    });

    it('Check change password functionality', () => {
      /* ==== Generated with Cypress Studio ==== */
      let requestTriggered = false;
      cy.intercept(
        {
          url: `${Cypress.env('apiBaseUrl')}/**`,
          method: 'GET',
        },
        () => {
          requestTriggered = true;
        },
      ).as('getRequests');
      /* ==== Generated with Cypress Studio ==== */
      cy.get('[data-cy="header-avatar"]').click();

      if (requestTriggered) {
        cy.wait('@getRequests');
        requestTriggered = false;
      }
      cy.get('[data-cy="SignIn-list"]').should('be.visible').click();
      cy.wait('@getRequests');
      cy.get('[data-cy="password-change-profile-button"]')
        .should('be.visible')
        .click();
      cy.get('[data-cy="password-change-profile-current-text-field"]')
        .should('be.visible')
        .clear();
      cy.get('[data-cy="password-change-profile-current-text-field"]').type(
        password,
      );
      cy.get('[data-cy="password-change-profile-new-text-field"]').clear();
      cy.get('[data-cy="password-change-profile-new-text-field"]').type(
        'P@ssw0rd',
      );
      cy.get('[data-cy="password-change-profile-confirm-text-field"]').clear();
      cy.get('[data-cy="password-change-profile-confirm-text-field"]').type(
        'P@ssw0rd',
      );
      cy.get('[data-cy="password-change-profile-save-button"]').click();
      cy.get('[data-cy="join-now-button"]').click();
      cy.get('[data-cy="login-email-text-field"]').clear();
      cy.get('[data-cy="login-email-text-field"]').type(email);
      cy.get('[data-cy="login-submit-button"]').click();
      cy.get('[data-cy="login-password-text-field"]').clear();
      cy.get('[data-cy="login-password-text-field"]').type('P@ssw0rd');
      cy.get('[data-cy="login-submit-button"]').click();
      cy.get('[data-cy="header-avatar"]').click();
      cy.get('[data-cy="name-profile-text"]').should('have.text', 'Test Test');
      /* ==== End Cypress Studio ==== */
    });
  });
});
