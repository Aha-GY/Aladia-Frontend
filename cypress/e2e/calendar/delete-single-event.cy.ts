describe('Delete single event', () => {
  context('Desktop Viewport (1200 x 800)', () => {
    let createdCalendarId; // Variable to store the created calendar ID
    let userId; // Variable to store the current userId
    let currentDate;
    let createdEventId;
    beforeEach(() => {
      cy.viewport(1200, 800);

      cy.login(
        Cypress.env('TEST_USER_EMAIL'),
        Cypress.env('TEST_USER_PASSWORD'),
      );

      cy.getUserId().then((id) => {
        userId = id;
      });
      const today = new Date();
      cy.dayjs(today).then((dayjsInstance) => {
        currentDate = dayjsInstance.format('YYYY-MM-DD');
      });
    });
    it('Should create a calendar event and verify it appears in the UI', () => {
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
      cy.visitDesktop(`/user/hub/${userId}/calendar`);
      cy.then(() => {
        if (requestTriggered) {
          cy.wait('@getRequests');
        }
      });
      cy.intercept('POST', `${Cypress.env('apiBaseUrl')}/calendars`).as(
        'createCalendar',
      );
      /* ==== Test Created with Cypress Studio ==== */
      /* ==== Generated with Cypress Studio ==== */
      cy.get('[data-cy="calendar-create-icon"]').click();
      cy.get('[data-cy="calendar-sidebar-on-add-detail-box"]').click();
      cy.get('[data-cy="calendar-title-text-field"]').clear('N');
      cy.get('[data-cy="calendar-title-text-field"]').type('New Calendar');
      cy.get('[data-cy="calendar-save-button"]').click();
      cy.get('[data-cy="calendar-sidebar-close-icon"] ').click();
      /* ==== End Cypress Studio ==== */

      // Capture the created calendar ID from the request/response
      cy.wait('@createCalendar').then((interception) => {
        expect(interception?.response?.statusCode).to.eq(201);
        createdCalendarId = interception.response?.body.id;
        cy.log('Calendar Created Successfully!');
        cy.get('[data-type="month"]').click();

        cy.intercept(
          'POST',
          `${Cypress.env('apiBaseUrl')}/calendars/${createdCalendarId}/events`,
        ).as('createCalendarEvent');
        // creating event in calender to be deleted
        cy.get(`[data-cy="${currentDate}-selected-date"]`).click();
        cy.get('[data-cy="calendar-event-title-text-field"]').click();
        cy.get('[data-cy="calendar-event-title-text-field"]').clear('M');
        cy.get('[data-cy="calendar-event-title-text-field"]').type(
          'Meeting with OOP teacher',
        );
        cy.get(
          '[data-cy="calendar-event-choose-calendar-button"] > .flex',
        ).click();
        cy.get(
          `[data-cy="${createdCalendarId}-selected-calendar-id"] > .flex`,
        ).click();
        cy.get('[data-cy="event-confirm-button"]').click();

        cy.get(
          '[data-cy="calendar-event-frequency-lable"] > .text-white',
        ).click();
        cy.get('[data-cy="does-not-repeat-frequency-of-the-event"]').click();
        cy.get('[data-cy="calendar-event-save-confirm-button"]').click();
        cy.wait('@createCalendarEvent').then((interception) => {
          expect(interception?.response?.statusCode).to.eq(201);
          cy.log('Calendar Event Created Successfully!');
          createdEventId = interception.response?.body.id;
          cy.log(createdEventId);

          cy.intercept(
            'DELETE',
            `${Cypress.env('apiBaseUrl')}/calendars/${createdCalendarId}/events/${createdEventId}`,
          ).as('deleteCalendarEvent');

          cy.get(
            `[data-cy="calendar-event-${createdEventId}-month-id-month-item-notIsAll"]`,
          ).click();
          cy.get('[data-cy="delete-event-confirm"]').click();
          cy.get(
            `[data-cy="calendar-event-${createdEventId}-month-id-month-item-notIsAll"]`,
          ).should('not.exist');
          cy.wait('@deleteCalendarEvent').then((interception) => {
            expect(interception?.response?.statusCode).to.eq(200);
          });
        });
      });
    });

    afterEach(() => {
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
