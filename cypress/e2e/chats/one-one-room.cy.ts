describe('Check session', () => {
  context('Desktop Viewport (1200 x 800)', () => {
    let roomId;

    beforeEach(() => {
      cy.viewport(1200, 800);

      cy.login(
        Cypress.env('TEST_USER_EMAIL'),
        Cypress.env('TEST_USER_PASSWORD'),
      );
      cy.getCookie('context').then((contextCookie) => {
        const userId = contextCookie?.value;
        cy.visitDesktop(`/user/hub/${userId}/chat`);
      });
    });

    /* ==== Test Created with Cypress Studio ==== */
    it('Creates one room on Desktop', () => {
      /* ==== Generated with Cypress Studio ==== */
      cy.get('[data-cy="chat-room-options-menu-button"]').should('be.visible');
      cy.get('[data-cy="chat-room-options-menu-button"]').click();
      cy.get('.el-popper.el-popover')
        .find('[data-cy="menu-item-New Room"]')
        .should('be.visible');
      cy.get('[data-cy="chat-room-options-menu-button"]').click();
      cy.get(
        '.el-popper.el-popover [data-cy="menu-item-New Room"] > .text-sm',
      ).click();
      cy.get(
        '.flex.h-0 > .py-2 > [data-cy="OrganizationHubChatInput-1"]',
      ).clear();
      cy.get('.flex.h-0 > .py-2 > [data-cy="OrganizationHubChatInput-1"]').type(
        'Test ',
      );
      cy.get(
        '[data-cy="OrganizationHubChatRightSideCreateMember-Test 5 Scenario"] > .w-0 > .truncate',
      ).click();
      /* ==== End Cypress Studio ==== */

      cy.intercept('POST', `${Cypress.env('apiBaseUrl')}/rooms`).as(
        'createRoom',
      );

      cy.wait('@createRoom').then((interception) => {
        if (interception.response && interception.response.statusCode === 201) {
          roomId = interception.response.body.id;
        }
      });
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
