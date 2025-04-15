describe('Check session', () => {
  context('Desktop Viewport (1200 x 800)', () => {
    let roomId;

    beforeEach(() => {
      cy.viewport(1200, 800);
      cy.login(
        Cypress.env('TEST_USER_EMAIL'),
        Cypress.env('TEST_USER_PASSWORD'),
      );

      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiBaseUrl')}/rooms`,
        body: {
          name: 'Mobile Team',
          type: 'group',
          members: [],
        },
      }).then((response) => {
        expect(response.status).to.eq(201);
        roomId = response.body.id;
      });
      cy.getCookie('context').then((contextCookie) => {
        const userId = contextCookie?.value;
        cy.visitDesktop(`/user/hub/${userId}/chat`);
      });
    });
    /* ==== Test Created with Cypress Studio ==== */
    it('Updates a chat room on Desktop', () => {
      /* ==== Generated with Cypress Studio ==== */
      cy.get(`[data-cy="chat-item-rooms-${roomId}"]`).should('be.visible');
      cy.get(`[data-cy="chat-item-rooms-${roomId}"] > .truncate`)
        .first()
        .should('have.text', 'Mobile Team ');
      cy.get(`[data-cy="296ab27d9e1bb791"] > [data-cy="chat-header-${roomId}"]`)
        .filter(':visible')
        .should('be.visible')
        .click();
      cy.get('[data-cy="f37f6c977fa42ded"] > .flex-col > .text-base').click();
      cy.get('[data-cy="chat-room-name-Mobile Team-text-field"]').click();
      cy.get('[data-cy="chat-room-name-Mobile Team-text-field"]').click();
      cy.get('[data-cy="chat-room-name-Mobile Team-text-field"]').click();
      cy.get('[data-cy="chat-room-name-Mobile Team-text-field"]').clear();
      cy.get('[data-cy="chat-room-name--text-field"]').type('Frontend Team');
      cy.get('[data-cy="1cabb2b399f190b6"]').click();
      cy.get(`[data-cy="chat-item-rooms-${roomId}"] > .truncate`).should(
        'be.visible',
      );
      cy.get(`[data-cy="chat-item-rooms-${roomId}"] > .truncate`)
        .first()
        .should('have.text', 'Frontend Team ');
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
