describe('Update a Comment on a Post', () => {
  context('Desktop Viewport (1200 x 800)', () => {
    let userId: string;
    let postId: string;
    let commentId: string;

    beforeEach(() => {
      cy.viewport(1200, 800);

      cy.login(
        Cypress.env('TEST_USER_EMAIL'),
        Cypress.env('TEST_USER_PASSWORD'),
      );

      cy.getUserId().then((id: string) => {
        userId = id;
        expect(userId).to.not.be.undefined;
      });

      // Create a post before test
      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiBaseUrl')}/posts`,
        body: {
          content: '<p>CICD: TEST post should have a comment to update</p>',
          files: [],
          mentions: [],
          title: '',
          type: 'post',
          visibility: 'restricted',
        },
      }).then((response) => {
        expect(response.status).to.eq(201);
        postId = response.body.id;
        // Create a comment before test
        cy.request({
          method: 'POST',
          url: `${Cypress.env('apiBaseUrl')}/comments`,
          body: {
            content: '<p>test comment to be UPDATED</p>',
            entity: { id: postId, type: 'post' },
            mentions: [],
          },
        }).then((response) => {
          expect(response.status).to.eq(201);
          commentId = response.body.id;
        });
      });
    });

    it('Should update a comment on a post', () => {
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

      cy.visitDesktop(`/user/hub/${userId}/feed?postId=${postId}`);

      cy.then(() => {
        if (requestTriggered) {
          cy.wait('@getRequests');
        }
      });

      cy.intercept(
        'PATCH',
        `${Cypress.env('apiBaseUrl')}/comments/${commentId}`,
      ).as('UpdateComment');

      /* ==== Generated with Cypress Studio ==== */
      cy.get('[data-cy="post-popup-comment-options-menu"]')
        .should('be.visible')
        .click();
      cy.get('[data-cy="post-popup-comment-edit-menu"]')
        .should('be.visible')
        .click();

      cy.get(
        '[data-cy="post-popup-comment-input-quill-editor-textarea"] > .ql-editor',
      ).clear();

      cy.get(
        '[data-cy="post-popup-comment-input-quill-editor-textarea"] > .ql-editor',
      ).type('test comment to be UPDATED BY CICD TEST');

      cy.get('[data-cy="post-popup-comment-input-send-button"]').click();

      cy.wait('@UpdateComment').then((interception) => {
        expect(interception?.response?.statusCode).to.eq(200);
        // should have be able to find the updated comment
        cy.get('[data-cy="post-comment-post-content-area"] > p').should(
          'have.text',
          'test comment to be UPDATED BY CICD TEST',
        );
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
    });
  });
});
