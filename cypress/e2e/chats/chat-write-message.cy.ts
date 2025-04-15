describe('Check session', () => {
  context('Desktop Viewport (1200 x 800)', () => {
    let roomId;

    before(() => {
      cy.viewport(1200, 800);
      cy.login(
        Cypress.env('TEST_USER_EMAIL'),
        Cypress.env('TEST_USER_PASSWORD'),
      );
      cy.visitDesktop('/');
    });
    it('Writes a message in a room', () => {
      /* ==== Generated with Cypress Studio ==== */
      cy.intercept('POST', `${Cypress.env('apiBaseUrl')}/rooms`).as(
        'createRoom',
      );
      cy.get('[data-cy="HeaderStateChat-message-icon"]').click();
      cy.get('[data-cy="OrganizationHubChatRightSide-go-to-chatview"]').click();

      cy.get('[data-cy="chat-room-options-menu-button"]').click();
      cy.get('[data-cy="menu-item-New Room"] > .text-sm').click();
      cy.get(
        '[data-cy="OrganizationHubChatRightSideCreate-create-group"] > .gap-2',
      ).click();
      cy.get(
        '[data-cy="OrganizationHubChatRightSideInfoHeader-edit-room"]',
      ).click();
      cy.wait('@createRoom').then((interception) => {
        expect(interception.response.statusCode).to.eq(201);

        roomId = interception.response.body.id;
        cy.intercept(
          'POST',
          `${Cypress.env('apiBaseUrl')}/rooms/${roomId}/messages`,
        ).as('sendMessage');
        cy.get('[data-cy="chat-room-name-New Room-text-field"]').click();
        cy.get('[data-cy="chat-room-name-New Room-text-field"]').clear();
        cy.get('[data-cy="chat-room-name--text-field"]').type('Frontend Team');
        cy.get('[data-cy="OrganizationHubChatRightSideEdit-save"]').click();
        cy.get(
          '[data-cy="OrganizationHubChatRightSideMediasMessagesHeader-close"] > .fa-light',
        ).click();
        cy.get('[data-cy="organization-hub-chat-page-1"]')
          .find(`[data-cy="chat-item-rooms-${roomId}"]`)
          .click();
        cy.get('[data-cy="organization-hub-chat-page-1"]')
          .find('[data-cy="default-quill-editor-textarea"] .ql-editor')
          .first()
          .invoke('text', 'Test message')
          .type('{enter}', { force: true });

        cy.wait('@sendMessage').then((interception) => {
          expect(interception.response.statusCode).to.eq(201);
        });

        cy.get('[data-cy="organization-hub-chat-page-1"]')
          .find('[data-cy="OrganizationHubChatContentAnswersOwn-1"] p')
          .should('be.visible')
          .should('have.text', 'Test message');
      });

      /* ==== End Cypress Studio ==== */
    });

    after(() => {
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
