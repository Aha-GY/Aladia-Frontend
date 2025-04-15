describe('Delete Profile', () => {
  context('Desktop Viewport (1200 x 800)', () => {
    let email: string;
    let isDeleted = false;

    beforeEach(() => {
      cy.viewport(1200, 800);
      isDeleted = false;

      cy.registerUserAndVerifyEmail().then(
        (creds: {
          email: string;
          password: string;
          name: string;
          token: string;
        }) => {
          email = creds.email;
          password = creds.password;
          mailboxName = creds.name;
          mailboxToken = creds.token;
          cy.login(email, password);
          cy.visitDesktop('/');
        },
      );
    });

    afterEach(() => {
      if (email && !isDeleted) {
        cy.request({
          method: 'DELETE',
          url: `${Cypress.env('apiBaseUrl')}/auth/users`,
        });
      }
    });

    it('Check deleting profile', () => {
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
      cy.then(() => {
        if (requestTriggered) {
          cy.wait('@getRequests');
        }
      });
      cy.get('[data-cy="Delete-list"]').scrollIntoView();
      cy.get('[data-cy="Delete-list"]').should('be.visible').click();
      cy.get('[data-cy="delete-account-button"]').click();
      cy.get('[data-cy="delete-account-password-text-field"]').clear();
      cy.get('[data-cy="delete-account-password-text-field"]').type(password);
      cy.get('[data-cy="delete-account-confirm-button"]').click();
      cy.get('[data-cy="join-now-button"]').should('be.visible');
      isDeleted = true;
      /* ==== End Cypress Studio ==== */
    });
  });
});
