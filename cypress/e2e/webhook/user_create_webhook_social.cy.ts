describe('Create Post', () => {
  context('Desktop Viewport (1200 x 800)', () => {
    let userId: string;
    let postId: string;
    let webhookId: string;

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
      cy.get('[data-cy="Webhook-list"]').click();

      cy.get('[data-cy="create-new-webhook-button"]').click();

      cy.get('[data-cy="webhook-title-text-field"]').type('E2E');
      cy.get('[data-cy="webhook-url-text-field"]').type(
        Cypress.env('webhookURL'),
      );

      cy.get('[data-cy="social-toggle-event-checkbox"] > .flex').click();
      cy.get('[data-cy="new-webhook-create-button"]').click();

      cy.wait('@CreateWebhook').then((interception) => {
        if (interception.response && interception.response.statusCode === 201) {
          webhookId = interception.response.body['id'];
          cy.get(
            '[data-cy="close-profile-setting-drawer"] > .fa-sharp',
          ).click();
          cy.visitDesktop(`/user/hub/${userId}/feed`);
          cy.intercept('POST', `${Cypress.env('apiBaseUrl')}/posts`).as(
            'CreatePost',
          );
          cy.get('[data-cy="feeds-create-post-trigger"] > .flex-1').click();
          cy.get(
            '[data-cy="create-post-quill-editor-textarea"] > .ql-editor',
          ).click();
          cy.get(
            '[data-cy="create-post-quill-editor-textarea"] > .ql-editor',
          ).type('TEST Webhook should create a post');
          cy.get('[data-cy="create-post-send-button"]').click();

          cy.wait('@CreatePost').then((interception) => {
            if (
              interception.response &&
              interception.response.statusCode === 201
            ) {
              postId = interception.response.body.id;

              cy.visitDesktop(`/user/hub/${userId}/feed?postId=${postId}`);

              expect(interception.response.body.visibility).to.eq('public');
              cy.get('[data-cy="post-popup-post-content-area"] > p').should(
                'have.text',
                'TEST Webhook should create a post',
              );
              cy.get('[data-cy="959f1963ce53ed97"] > .fa-light').click();
              cy.get('[data-cy="header-avatar"]').click();
              cy.get('[data-cy="Webhook-list"] > div').click();
              cy.get(
                `[data-cy="${webhookId}-webhook-title-url"] > .order-0`,
              ).click();
              cy.get('post.created-webhook-event').click();
              cy.get('[data-cy="webhook-event-code"]').should(
                'have.text',
                '200',
              );
              cy.get('[data-cy="webhook-event-name"]').should(
                'have.text',
                'post.created',
              );
            } else {
              cy.log('Failed to create post: No response received');
            }
          });
        } else {
          cy.log('Failed to create webhook: No response received');
        }
      });

      /* ==== End Cypress Studio ==== */
    });

    afterEach(() => {
      if (postId) {
        cy.request({
          method: 'Delete',
          url: `${Cypress.env('apiBaseUrl')}/posts/${postId}`,
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
