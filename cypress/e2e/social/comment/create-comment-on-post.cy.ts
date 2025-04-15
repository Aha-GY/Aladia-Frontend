describe('Create a Comment on a Post', () => {
  context('Desktop Viewport (1200 x 800)', () => {
    let userId: string;
    let postId: string;

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
          content: '<p>CICD: TEST post should have a comment</p>',
          files: [],
          mentions: [],
          title: '',
          type: 'post',
          visibility: 'restricted',
        },
      }).then((response) => {
        expect(response.status).to.eq(201);
        postId = response.body.id;
      });
    });

    it('Should comment on a post', () => {
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

      cy.get(
        '[data-cy="post-popup-comment-input-quill-editor-textarea"] > .ql-editor',
      )
        .should('be.visible')
        .click();

      cy.get(
        '[data-cy="post-popup-comment-input-quill-editor-textarea"] > .ql-editor',
      ).type('CICD: TEST should create a comment');

      cy.get('[data-cy="post-popup-comment-input-send-button"]').click();
      cy.get('[data-cy="post-comment-post-content-area"] > p').should(
        'be.visible',
      );
      cy.get('[data-cy="post-comment-post-content-area"] > p').should(
        'have.text',
        'CICD: TEST should create a comment',
      );

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
