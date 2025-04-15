describe('Create calendar', () => {
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
    });
    it('Should desktop Home page is ready with logged-in user and create a calendar', () => {
      cy.visitDesktop(`/user/hub/${userId}/calendar`);
      cy.intercept('POST', `${Cypress.env('apiBaseUrl')}/calendars`).as(
        'createCalendar',
      );
      /* ==== Test Created with Cypress Studio ==== */
      /* ==== Generated with Cypress Studio ==== */
      cy.get('[data-cy="calendar-create-icon"]').click();
      cy.get('[data-cy="calendar-sidebar-on-add-detail-box"]').click();
      cy.get('[data-cy="calendar-title-text-field"]').clear('N');
      cy.get('[data-cy="calendar-title-text-field"]').type('New Calendar');
      cy.get('[data-cy="calendar-theme-color-text-field"]').click();
      cy.get('[style="--pcr-color: rgba(132, 94, 238, 1)"]').click();
      cy.get('[data-cy="calendar-base-event-duration-text-field"]').click();
      cy.get('[data-cy="60-label"]').click();
      cy.get('[data-cy="calendar-time-zone-text-field"]').click();
      cy.get('[data-cy="5-time-zone"]').click();
      cy.get('[data-cy="calendar-save-button"]').click();
      cy.get('[data-cy="calendar-sidebar-close-icon"] ').click();
      /* ==== End Cypress Studio ==== */

      // Capture the created calendar ID from the request/response
      cy.wait('@createCalendar').then((interception) => {
        expect(interception?.response?.statusCode).to.eq(201);
        createdCalendarId = interception.response?.body.id;
        cy.log('Calendar Created Successfully!');
      });
    });

    afterEach(() => {
      // Clean up: Delete the created calendar if it exists
      if (createdCalendarId) {
        cy.request({
          method: 'DELETE',
          url: `${Cypress.env('apiBaseUrl')}/calendars/${createdCalendarId}`,
        }).then((response) => {
          expect(response.status).to.eq(200); // Confirm successful deletion
          cy.log(`Deleted Calendar Successfully!`);
        });
      }
    });
  });
});
