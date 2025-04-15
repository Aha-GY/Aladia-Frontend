describe('Delete Post', () => {
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
          content: '<p>CICD: TEST should delete a post</p>',
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

    it('Should verify the created post content and delete it', () => {
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

      cy.intercept('DELETE', `${Cypress.env('apiBaseUrl')}/posts/${postId}`).as(
        'DeletePost',
      );

      //   /* ==== Generated with Cypress Studio ==== */
      cy.get('[data-cy="post-popup-options-menu-button"] > .fa-light')
        .should('be.visible')
        .click();
      cy.get('[data-cy="post-popup-options-delete-menu"]')
        .should('be.visible')
        .click();
      cy.get('[data-cy="delete-post-confirm-button"]')
        .should('be.visible')
        .click();

      cy.wait('@DeletePost').then((interception) => {
        expect(interception?.response?.statusCode).to.eq(200);
      });
      /* ==== End Cypress Studio ==== */
    });
  });
});
