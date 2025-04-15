describe('Create does not repeat calendar event', () => {
  context('Desktop Viewport (1200 x 800)', () => {
    let createdCalendarId; // Variable to store the created calendar ID
    let userId; // Variable to store the current userId
    let currentDate;
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
      const today = new Date();
      cy.dayjs(today).then((dayjsInstance) => {
        currentDate = dayjsInstance.format('YYYY-MM-DD');
      });
    });
    it('Should create a calendar event and verify it appears in the UI', () => {
      cy.visitDesktop(`/user/hub/${userId}/calendar`);
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
      });

      // Verify that the event appears in the UI
      cy.get(`[data-cy="${currentDate}-selected-date"]`).within(() => {
        cy.contains('Meeting with OOP teacher').should('be.visible');
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
