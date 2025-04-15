describe('Check session', () => {
  context('Desktop Viewport (1200 x 800)', () => {
    let roomId;
    beforeEach(() => {
      cy.viewport(1200, 800);
      cy.login(
        Cypress.env('TEST_USER_EMAIL'),
        Cypress.env('TEST_USER_PASSWORD'),
      );

      cy.visitDesktop('/');
    });
    /* ==== Test Created with Cypress Studio ==== */
    it('Creates a group chat room Desktop', () => {
      cy.intercept('POST', `${Cypress.env('apiBaseUrl')}/rooms`).as(
        'createRoom',
      );
      /* ==== Generated with Cypress Studio ==== */
      cy.get('[data-cy="788152bfd47724ac"]').should('be.visible');
      cy.get('[data-cy="788152bfd47724ac"]').click();
      cy.get('[data-cy="d1ee4df17ec16bac"]').click();
      cy.get('[data-cy="chat-room-options-menu-button"]').should('be.visible');
      cy.get('[data-cy="chat-room-options-menu-button"]').click();
      cy.get('[data-cy="0bfc35ab516d20e4"] .fa-plus').should('be.visible');
      cy.get('[data-cy="chat-room-options-menu-button"]').click();
      cy.get('[data-cy="0bfc35ab516d20e4"] .fa-plus').click();
      cy.get('[data-cy="01a1e07ac102a9a2"] > .gap-2').click();
      cy.get('[data-cy="f37f6c977fa42ded"]').click();
      cy.wait('@createRoom').then((interception) => {
        expect(interception.response.statusCode).to.eq(201);

        roomId = interception.response.body.id;
      });
      cy.get('[data-cy="chat-room-name-New Room-text-field"]').click();
      cy.get('[data-cy="chat-room-name-New Room-text-field"]').clear();
      cy.get('[data-cy="chat-room-name--text-field"]').type('Frontend Team');
      cy.get('[data-cy="1cabb2b399f190b6"] > .fa-light').click();
      /* ==== End Cypress Studio ==== */
    });

    afterEach(() => {
      if (roomId) {
        cy.request({
          method: 'DELETE',
          url: `${Cypress.env('apiBaseUrl')}/rooms/${roomId}`,
        }).then((response) => {
          expect(response.status).to.eq(204);
        });
      }
    });
  });
});
