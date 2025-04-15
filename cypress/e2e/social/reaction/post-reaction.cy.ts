describe('Create,Update, list and Delete a Post Reaction', () => {
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
          content:
            '<p>CICD: TEST post should have a reaction, update it and remove it</p>',
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

    it('Should create,update and remove a post reaction', () => {
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

      cy.visitDesktop(`/user/hub/${userId}/feed`);

      cy.then(() => {
        if (requestTriggered) {
          cy.wait('@getRequests');
        }
      });

      cy.intercept({
        url: `${Cypress.env('apiBaseUrl')}/reactions`,
        method: 'POST',
      }).as('createReaction');

      /* ==== Generated with Cypress Studio ==== */

      // reaction
      cy.get(
        `[data-cy="feeds-post-card-${postId}-footer-post-react-button"]`,
      ).trigger('mouseenter');
      cy.get(
        `[data-cy="feeds-post-card-${postId}-footer-post-react-list-post-clap-reaction"]`,
      ).click();
      cy.get(`[data-cy="feeds-post-card-${postId}"]`).click();

      cy.get(`[data-cy="feeds-post-card-${postId}-react-clap-emoji"]`).should(
        'be.visible',
      );
      cy.wait('@createReaction').then((interception) => {
        expect(interception?.response?.statusCode).to.eq(201);
      });

      // update reaction
      cy.get(
        `[data-cy="feeds-post-card-${postId}-footer-post-react-button"]`,
      ).trigger('mouseenter');

      cy.get(
        `[data-cy="feeds-post-card-${postId}-footer-post-react-list-post-love-reaction"]`,
      ).click();
      cy.get(`[data-cy="feeds-post-card-${postId}"]`).click();
      cy.get(`[data-cy="feeds-post-card-${postId}-react-love-emoji"]`).should(
        'be.visible',
      );

      // list all reactions
      cy.get(`[data-cy="feeds-post-card-${postId}-react-total-count"]`)
        .should('be.visible')
        .click();
      cy.get(`[data-cy="post-reacting-user-${userId}"]`).should('be.visible');

      // remove
      cy.get('[data-cy="post-reacting-user-list-close-button"]').click();
      cy.get(
        `[data-cy="feeds-post-card-${postId}-footer-post-react-button"]`,
      ).click();
      cy.get(`[data-cy="feeds-post-card-${postId}-react-love-emoji"]`).should(
        'not.be.exist',
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
