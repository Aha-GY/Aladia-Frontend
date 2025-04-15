describe('Connect Google Account', () => {
  context('Desktop Viewport (1200 x 800)', () => {
    let googleAccountLinked = false;
    function unlinkGoogleAccount() {
      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiBaseUrl')}/auth/google/unlink`,
      }).then((response) => {
        expect(response.body.unlink).to.eq(true);
        googleAccountLinked = false;
      });
    }

    beforeEach(() => {
      cy.viewport(1200, 800);

      cy.login(
        Cypress.env('TEST_USER_EMAIL'),
        Cypress.env('TEST_USER_PASSWORD'),
      );
      cy.request({
        method: 'GET',
        url: `${Cypress.env('apiBaseUrl')}/auth/connected-accounts`,
      }).then((response) => {
        if (response.body.google === true) {
          unlinkGoogleAccount();
        }
        cy.visitDesktop('/');
      });
    });

    afterEach(() => {
      if (googleAccountLinked) {
        unlinkGoogleAccount();
      }
    });

    it('Check UI reaction to connect google account', () => {
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
      }
      cy.get('[data-cy="SignIn-list"]').should('be.visible').click();
      cy.get('[data-cy="google-account-connect-button"]').should('be.visible');
      cy.loginByGoogleApi().then(() => {
        googleAccountLinked = true;
      });
      cy.get('[data-cy="close-profile-setting-drawer"]').click();
      cy.get('[data-cy="SignIn-list"]').click();
      cy.get('[data-cy="google-account-disconnect-button"]').should(
        'be.visible',
      );
      /* ==== End Cypress Studio ==== */
    });
  });
});
