describe('Check session', () => {
  context('Desktop Viewport (1200 x 800)', () => {
    beforeEach(() => {
      cy.viewport(1200, 800);

      cy.login(
        Cypress.env('TEST_USER_EMAIL'),
        Cypress.env('TEST_USER_PASSWORD'),
      );

      cy.request({
        method: 'GET',
        url: `${Cypress.env('apiBaseUrl')}/auth/api-tokens/`,
      }).then((response) => {
        const apiKeyIds = response.body.data.map((apiKey) => apiKey.id);
        // Delete all API keys by mapping through the array of API key IDs
        apiKeyIds.map((apiKeyId) => {
          cy.request({
            method: 'DELETE',
            url: `${Cypress.env('apiBaseUrl')}/auth/api-tokens/${apiKeyId}/`,
          });
        });
      });

      cy.visitDesktop('/');
    });

    /* ==== Test Created with Cypress Studio ==== */
    it('Check API Key Generation, Update and Deletion', () => {
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
      cy.get('[data-cy="APIKey-list"]').should('be.visible').click();
      cy.get('[data-cy="no-api-key"').should('be.visible');
      cy.get('[data-cy="new-api-access-token-button"]').click();
      cy.get('[data-cy="new-api-access-token-name-text-field"]').clear();
      cy.get('[data-cy="new-api-access-token-name-text-field"]').type('test');
      cy.get('[data-cy="new-api-access-token-expiration-text-field"]').click();
      cy.get(
        '[data-cy="new-api-access-token-expiration-month-year-date-picker"] > .font-bold',
      ).click();
      cy.get(
        '[data-cy="new-api-access-token-expiration-right-arrow-date-picker"] > .fa-solid',
      ).click();
      cy.get(
        '[data-cy="new-api-access-token-expiration-1-number-of-month-date-picker"]',
      ).click();
      cy.get(
        '[data-cy="new-api-access-token-expiration-day-3-date-picker"]',
      ).click();
      cy.get('[data-cy="new-api-access-token-save"]').click();
      cy.get('[data-cy="api-key-value-test"').should('have.text', 'test');
      cy.get('[data-cy="edit-api-key-menu-popup-trigger"]').click();
      cy.get('[data-cy="edit-api-key-button"]').click();
      cy.get('[data-cy="new-api-access-token-name-text-field"]').clear();
      cy.get('[data-cy="new-api-access-token-name-text-field"]').type(
        'test-updated',
      );
      cy.get('[data-cy="new-api-access-token-save"]').click();
      cy.get('[data-cy="api-key-value-test-updated"').should(
        'have.text',
        'test-updated',
      );
      cy.get('[data-cy="edit-api-key-menu-popup-trigger"]').click();
      cy.get('[data-cy="delete-api-key-button"]').click();
      cy.get('[data-cy="no-api-key"').should('be.visible');
      /* ==== End Cypress Studio ==== */
    });
  });
});
