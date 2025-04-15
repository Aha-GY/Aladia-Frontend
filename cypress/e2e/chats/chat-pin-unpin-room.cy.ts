describe('Check session', () => {
  context('Desktop Viewport (1200 x 800)', () => {
    let roomId;

    before(() => {
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
    it('Pins a chat room on Desktop', () => {
      /* ==== Generated with Cypress Studio ==== */
      cy.get('[data-cy="organization-hub-chat-page-1"]')
        .find(`[data-cy="chat-item-rooms-${roomId}"]`)
        .rightclick();
      cy.get(
        '.el-popover.room-options [data-cy="OrganizationHubChatLeftSideOptions-1"] > .text-sm',
      ).then(($el) => {
        $el[0].click();
      });
      cy.get('[data-cy="organization-hub-chat-page-1"]')
        .find(`[data-cy="chat-item-rooms-${roomId}"]`)
        .rightclick();
      cy.get(
        '.el-popover.room-options [data-cy="OrganizationHubChatLeftSideOptions-1"] > .text-sm',
      ).then(($el) => {
        $el[0].click();
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
