describe('Social | create post, Comment and reactions', () => {
  context('Desktop Viewport (1200 x 800)', () => {
    let postId: string;
    let userId: string;

    beforeEach(() => {
      cy.viewport(1200, 800);

      cy.login(
        Cypress.env('TEST_USER_EMAIL'),
        Cypress.env('TEST_USER_PASSWORD'),
      );

      cy.getUserId().then((id: string) => {
        userId = id;
        cy.visitDesktop(`/user/hub/${userId}/feed`);
      });
    });
    it('Should create Post, others login and comment react on it, see all reaction and remove their reaction', () => {
      /* ==== Generated with Cypress Studio ==== */
      cy.intercept('POST', `${Cypress.env('apiBaseUrl')}/posts`).as(
        'CreatePost',
      );
      cy.get('[data-cy="feeds-create-post-trigger"] > .flex-1').click();
      cy.get(
        '[data-cy="create-post-quill-editor-textarea"] > .ql-editor',
      ).click();
      cy.get('[data-cy="create-post-quill-editor-textarea"] > .ql-editor').type(
        'CICD: TEST should create a post, other react and comment on this',
      );
      cy.get(
        '[data-cy="create-post-emoji-popup-trigger"] > .fa-regular',
      ).click();

      cy.get(
        ':nth-child(1) > .min-h-\\[23\\.875rem\\] > .left-2 > :nth-child(1) > .v3-emoji-picker > .v3-body > .v3-body-inner > #my_custom_group > .v3-emojis > :nth-child(1) > span',
      ).click();
      cy.get(
        ':nth-child(1) > .min-h-\\[23\\.875rem\\] > .left-2 > :nth-child(1) > .v3-emoji-picker > .v3-header > .v3-search > input',
      ).type('glob');
      cy.get(
        ':nth-child(1) > .min-h-\\[23\\.875rem\\] > .left-2 > :nth-child(1) > .v3-emoji-picker > .v3-body > .v3-body-inner > #travel_places > .v3-emojis > :nth-child(1) > span',
      ).click();

      cy.get('[data-cy="create-post-send-button"]').click();

      // /* ==== End Cypress Studio ==== */

      cy.wait('@CreatePost').then((interception) => {
        expect(interception.response.body.id).to.not.be.undefined;
        postId = interception.response.body.id;

        cy.get(
          `[data-cy="feeds-post-card-${postId}-info-post-content-area"] > p`,
        ).should(
          'have.text',
          'CICD: TEST should create a post, other react and comment on this😂🌍',
        );

        cy.login(
          Cypress.env('TEST_TEACHER_USER_EMAIL'),
          Cypress.env('TEST_TEACHER_USER_PASSWORD'),
        );

        cy.getUserId().then((id: string) => {
          userId = id;
          cy.visitDesktop(`/user/hub/${id}/feed`);

          cy.intercept({
            url: `${Cypress.env('apiBaseUrl')}/reactions`,
            method: 'POST',
          }).as('createReaction');
          // reaction
          cy.get(
            `[data-cy="feeds-post-card-${postId}-footer-post-react-button"]`,
          ).trigger('mouseenter');
          cy.get(
            `[data-cy="feeds-post-card-${postId}-footer-post-react-list-post-clap-reaction"]`,
          ).click();
          cy.get(`[data-cy="feeds-post-card-${postId}"]`).click();
          cy.wait('@createReaction');
          cy.get(
            `[data-cy="feeds-post-card-${postId}-react-clap-emoji"]`,
          ).should('be.visible');
          // see all reactions
          cy.get(`[data-cy="feeds-post-card-${postId}-react-total-count"]`)
            .should('be.visible')
            .click();
          cy.get(`[data-cy="post-reacting-user-${userId}"]`).should(
            'be.visible',
          );
          // // remove
          cy.get('[data-cy="post-reacting-user-list-close-button"]').click();
          cy.get(
            `[data-cy="feeds-post-card-${postId}-footer-post-react-button"]`,
          ).click();
          cy.get(
            `[data-cy="feeds-post-card-${postId}-react-love-emoji"]`,
          ).should('not.be.exist');

          cy.get(
            `[data-cy="feeds-post-card-${postId}-footer-post-comment-button"]`,
          ).click();
          cy.get(
            '[data-cy="post-popup-comment-input-quill-editor-textarea"] > .ql-editor',
          )
            .should('be.visible')
            .click();

          cy.get(
            '[data-cy="post-popup-comment-input-quill-editor-textarea"] > .ql-editor',
          ).type('CICD: TEST should create a comment');

          cy.get('[data-cy="post-popup-comment-input-send-button"]').click();
        });
      });
    });
    afterEach(() => {
      if (postId) {
        cy.login(
          Cypress.env('TEST_USER_EMAIL'),
          Cypress.env('TEST_USER_PASSWORD'),
        );
        cy.request({
          method: 'Delete',
          url: `${Cypress.env('apiBaseUrl')}/posts/${postId}`,
        });
      }
    });
  });
});
