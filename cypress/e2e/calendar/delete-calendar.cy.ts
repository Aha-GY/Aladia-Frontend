describe('Delete calendar ', () => {
  context('Desktop Viewport (1200 x 800)', () => {
    let createdCalendarId; // Variable to store the created calendar ID
    let userId; // variable to store the current userId
    beforeEach(() => {
      cy.viewport(1200, 800);
      cy.login(
        Cypress.env('TEST_USER_EMAIL'),
        Cypress.env('TEST_USER_PASSWORD'),
      );
      cy.getUserId().then((id) => {
        userId = id;
      });
      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiBaseUrl')}/calendars`,
        body: {
          name: 'calendar',
          type: 'public',
          color: '#4B0082',
        },
      }).then((response) => {
        expect(response.status).to.eq(201);
        createdCalendarId = response.body['id'];
        cy.log(response.body['id']);
      });
    });

    /* ==== Test Created with Cypress Studio ==== */
    it('Desktop Home page is ready with logged-in user and Delete a calendar', () => {
      cy.visitDesktop(`/user/hub/${userId}/calendar`);
      cy.get(
        `[data-cy="${createdCalendarId}-list-of-calanders-three-dots"] > .fa-light`,
      )
        .should('be.visible')
        .click({ force: true });
      cy.intercept(
        'DELETE',
        `${Cypress.env('apiBaseUrl')}/calendars/${createdCalendarId}`,
      ).as('deleteCalendar');
      /* ==== Generated with Cypress Studio ==== */
      cy.get('[data-cy="calendar-remove-popup-button"]').click();
      /* ==== End Cypress Studio ==== */
      cy.wait('@deleteCalendar').then((interception) => {
        expect(interception?.response?.statusCode).to.eq(200);
        cy.log('Calendar Deleted Successfully!');
      });
    });
  });
});
