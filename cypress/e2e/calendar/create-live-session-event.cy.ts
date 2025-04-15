describe('Create live session event ', () => {
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
      const today = new Date(); // Current date
      cy.dayjs(today).then((dayjsInstance) => {
        currentDate = dayjsInstance.format('YYYY-MM-DD');
      });
    });
    it('Should create a calendar live session event and verify it appears in the UI', () => {
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
      /* ==== Generated with Cypress Studio ==== */
      cy.get('[data-cy="calendar-create-icon"]').click();
      cy.get('[data-cy="calendar-sidebar-on-add-detail-box"]').click();
      cy.get('[data-cy="calendar-title-text-field"]').clear('N');
      cy.get('[data-cy="calendar-title-text-field"]').type('New Calendar');
      cy.get('[data-cy="calendar-save-button"]').click();
      /* ==== End Cypress Studio ==== */

      // Capture the created calendar ID from the request/response
      cy.wait('@createCalendar').then((interception) => {
        expect(interception?.response?.statusCode).to.eq(201);
        createdCalendarId = interception.response?.body.id;
        cy.get('[data-cy="calendar-sidebar-close-icon"] ').click();

        cy.log('Calendar Created Successfully!');
        cy.log(createdCalendarId);
        cy.get('[data-type="month"]').click();
        cy.intercept(
          'POST',
          `${Cypress.env('apiBaseUrl')}/calendars/${createdCalendarId}/events`,
        ).as('createCalendarEvent');

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
        cy.get('[data-cy="all-day-event-checkbox"]').click();
        cy.get('[data-cy="event-create-room-button"]').click();
        cy.get(
          '[data-cy="calendar-event-frequency-lable"] > .text-white',
        ).click();
        cy.get('[data-cy="does-not-repeat-frequency-of-the-event"]').click();
        cy.get(
          '[data-cy="event-description-quill-editor"] > .ql-editor > p',
        ).click();
        cy.get(
          '[data-cy="event-description-quill-editor"] > .ql-editor > p',
        ).type('Description Meeting with OOP teacher');
        cy.get('[data-cy="calendar-event-save-confirm-button"]').click();

        cy.wait('@createCalendarEvent').then((interception) => {
          expect(interception?.response?.statusCode).to.eq(201);
          cy.log('Calendar Event Created Successfully!');
          createdEventId = interception.response?.body.id;
          // Verify that the event appears in the UI
          cy.get(
            `[data-cy="calendar-event-${createdEventId}-month-id-month-item-isLive"]`,
          ).should('exist');
          cy.get(`[data-cy="${currentDate}-selected-date"]`).within(() => {
            cy.contains('Meeting with OOP teacher').should('be.visible');
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
