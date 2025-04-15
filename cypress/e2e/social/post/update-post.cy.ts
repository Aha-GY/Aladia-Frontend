describe('Update Post', () => {
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
          content: '<p>CICD: TEST should update a post</p>',
          files: [],
          mentions: [],
          title: '',
          type: 'post',
          visibility: 'private',
        },
      }).then((response) => {
        expect(response.status).to.eq(201);
        postId = response.body.id;
      });
    });

    it('Should verify the created post content and update it', () => {
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

      cy.intercept('PATCH', `${Cypress.env('apiBaseUrl')}/posts/${postId}`).as(
        'UpdatePost',
      );

      //   /* ==== Generated with Cypress Studio ==== */
      cy.get('[data-cy="post-popup-options-menu-button"] > .fa-light')
        .should('be.visible')
        .click();

      cy.get('[data-cy="post-popup-options-edit-menu"]')
        .should('be.visible')
        .click();

      cy.get(
        '[data-cy="edit-post-quill-editor-textarea"] > .ql-editor',
      ).clear();

      cy.get('[data-cy="edit-post-quill-editor-textarea"] > .ql-editor').type(
        'CICD: TEST post updated by CICD',
      );
      cy.get('[data-cy="edit-post-send-button"]').click();

      cy.wait('@UpdatePost').then((interception) => {
        expect(interception?.response?.statusCode).to.eq(200);

        cy.visitDesktop(`/user/hub/${userId}/feed?postId=${postId}`);

        cy.then(() => {
          if (requestTriggered) {
            cy.wait('@getRequests');
          }
          /* ==== Generated with Cypress Studio ==== */
          cy.get('[data-cy="post-popup-post-content-area"] > p').should(
            'have.text',
            'CICD: TEST post updated by CICD',
          );
          /* ==== End Cypress Studio ==== */
        });
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
