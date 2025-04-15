describe('Create Post', () => {
  context('Desktop Viewport (1200 x 800)', () => {
    let spaceId: string;
    let webhookId: string;
    let userId: string;

    beforeEach(() => {
      cy.viewport(1200, 800);
      cy.login(Cypress.env('email'), Cypress.env('password'));
      cy.getUserId().then((id) => {
        userId = id;
        cy.visitDesktop(`/`);
      });
    });
    it('Should setup a webhook create a post and get the post response on the webhook', () => {
      /* ==== Generated with Cypress Studio ==== */
      cy.intercept('POST', `${Cypress.env('apiBaseUrl')}/webhooks`).as(
        'CreateWebhook',
      );
      cy.get('[data-cy="header-avatar"]').click();
      cy.get('[data-cy="Webhook-list"] > div').click();

      cy.get('[data-cy="create-new-webhook-button"]').click();

      cy.get('[data-cy="webhook-title-text-field"]').type('E2E');
      cy.get('[data-cy="webhook-url-text-field"]').type(
        Cypress.env('webhookURL'),
      );

      cy.get('[data-cy="space-toggle-event-checkbox"] > .flex').click();
      cy.get('[data-cy="new-webhook-create-button"]').click();
      cy.wait('@CreateWebhook').then((interception) => {
        if (interception.response && interception.response.statusCode === 201) {
          webhookId = interception.response.body['id'];

          cy.get(
            '[data-cy="close-profile-setting-drawer"] > .fa-sharp',
          ).click();
          cy.get('[data-cy="sidebar-space-icon"]').click();
          cy.intercept('POST', `${Cypress.env('apiBaseUrl')}/spaces`).as(
            'CreateSpace',
          );

          cy.visitDesktop(`/user/hub/${userId}/spaces`);
          cy.get('[data-cy="new-space-icon"]').click();

          cy.wait('@CreateSpace').then((interception) => {
            if (
              interception.response &&
              interception.response.statusCode === 201
            ) {
              spaceId = interception.response.body.id;
              cy.get('[data-cy="course-space-label"]').click();
              cy.get('[data-cy="header-avatar"]').click();
              cy.get('[data-cy="Webhook-list"] > div').click();
              cy.get(
                `[data-cy="${webhookId}-webhook-title-url"] > .order-0`,
              ).click();
              cy.get('[data-cy="space.created-webhook-event"]').click();

              cy.get('[data-cy="webhook-event-code"]').should(
                'have.text',
                '200',
              );
              cy.get('[data-cy="webhook-event-name"]').should(
                'have.text',
                'space.created',
              );
            } else {
              cy.log('Space was not created');
            }
          });
        } else {
          cy.log('Webhook was not created');
        }
      });
    });

    afterEach(() => {
      if (spaceId) {
        cy.request({
          method: 'Delete',
          url: `${Cypress.env('apiBaseUrl')}/spaces/${spaceId}`,
        });
      }
      if (webhookId) {
        cy.request({
          method: 'Delete',
          url: `${Cypress.env('apiBaseUrl')}/webhooks/${webhookId}`,
        });
      }
    });
  });
});
