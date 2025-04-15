describe('Create Post', () => {
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
        cy.visitDesktop(`/user/hub/${id}/feed`);
      });
    });
    it('Should Create a Post', () => {
      /* ==== Generated with Cypress Studio ==== */
      cy.get('[data-cy="feeds-create-post-trigger"] > .flex-1').click();
      cy.get(
        '[data-cy="create-post-quill-editor-textarea"] > .ql-editor',
      ).click();
      cy.get('[data-cy="create-post-quill-editor-textarea"] > .ql-editor').type(
        'CICD: TEST should create a post',
      );

      cy.get('[data-cy="00155512b8a40b06"]').click();
      cy.get(
        '.min-h-\\[23\\.875rem\\] > .left-2 > :nth-child(1) > .v3-emoji-picker > .v3-body > .v3-body-inner > #my_custom_group > .v3-emojis > :nth-child(1) > span',
      ).click();
      cy.get(
        '.min-h-\\[23\\.875rem\\] > .left-2 > :nth-child(1) > .v3-emoji-picker > .v3-header > .v3-search > input',
      ).type('glob');
      cy.get(
        '.min-h-\\[23\\.875rem\\] > .left-2 > :nth-child(1) > .v3-emoji-picker > .v3-body > .v3-body-inner > #travel_places > .v3-emojis > :nth-child(1) > span',
      ).click();
      cy.get('[data-cy="create-post-send-button"]').click();

      /* ==== End Cypress Studio ==== */
      cy.intercept('POST', `${Cypress.env('apiBaseUrl')}/posts`).as(
        'CreatePost',
      );

      cy.wait('@CreatePost').then((interception) => {
        //
        if (interception.response && interception.response.statusCode === 201) {
          postId = interception.response.body.id;

          cy.visitDesktop(`/user/hub/${userId}/feed?postId=${postId}`);

          expect(interception.response.body.visibility).to.eq('public');
          cy.get('[data-cy="post-popup-post-content-area"] > p').should(
            'have.text',
            'CICD: TEST should create a post😂🌍',
          );
        } else {
          cy.log('Failed to create post: No response received');
        }
      });
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
  // context('Mobile Viewport (550 x 800)', () => {
  //   beforeEach(() => {
  //     cy.viewport(550, 800);
  //     cy.log(JSON.stringify(Cypress.env()));

  //     cy.login(
  //       Cypress.env('TEST_USER_EMAIL'),
  //       Cypress.env('TEST_USER_PASSWORD'),
  //     );

  //     cy.visitMobile('/');
  //   });
  //   it('Mobile Home page is ready with logged in user', () => {
  //     // Home page with logged in user is available
  //     // write your Mobile tests here
  //   });
  // });
});
