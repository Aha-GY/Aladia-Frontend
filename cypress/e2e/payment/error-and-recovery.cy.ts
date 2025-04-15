describe('Payment Error and Recovery User Journey', () => {
  context('Desktop Viewport (1200 x 800)', () => {
    beforeEach(() => {
      cy.viewport(1200, 800);
      cy.login(
        Cypress.env('TEST_USER_EMAIL'),
        Cypress.env('TEST_USER_PASSWORD'),
      );
      cy.visitDesktop('/');
    });

    it('Checkout', () => {
      cy.visitDesktop('/');
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

      cy.then(() => {
        if (requestTriggered) {
          cy.wait('@getRequests');
        }
      });
      /* ==== Generated with Cypress Studio ==== */
      cy.get('[data-cy="header-avatar"]').click();
      cy.get('[data-cy="Payments-list"]').scrollIntoView().click();
      cy.get('[data-cy="add-payment-method"]').click();
      cy.get('#Field-numberInput').type('4000000000009995');
      /* ==== End Cypress Studio ==== */
    });
  });
});
