describe('Update multiple  event', () => {
  context('Desktop Viewport (1200 x 800)', () => {
    let createdCalendarId; // Variable to store the created calendar ID
    let userId; // Variable to store the current userId
    let currentDate;
    let currentDateSelector;
    let createdEventId;
    let nextDateSelector;

    // Helper function to login and setup
    function setupCalendar() {
      cy.viewport(1200, 800);
      cy.login(
        Cypress.env('TEST_USER_EMAIL'),
        Cypress.env('TEST_USER_PASSWORD'),
      );

      cy.getUserId().then((id) => {
        userId = id;
      });

      // Set current and next date selectors
      const today = new Date();
      cy.dayjs(today).then((dayjsInstance) => {
        currentDate = dayjsInstance.format('YYYY-MM-DD');
        currentDateSelector = `[data-cy="${currentDate}-selected-date"]`;
      });

      cy.dayjs().then((dayjsInstance) => {
        const tomorrow = dayjsInstance.add(1, 'day').toDate(); // Add 1 day and convert to Date
        cy.dayjs(tomorrow).then((nextDayInstance) => {
          const nextDate = nextDayInstance.format('YYYY-MM-DD');

          nextDateSelector = `[data-cy="${nextDate}-selected-date"]`;
        });
      });
    }

    // Helper function to create an event
    function updateCreatedMultipleEvent(frequency, deleteType) {
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

        cy.get(currentDateSelector).click();
        cy.get('[data-cy="calendar-event-title-text-field"]').clear(
          'Meeting with OOP teacher',
        );
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
        cy.get(`[data-cy="${frequency}-frequency-of-the-event"]`).click();
        cy.get(
          '[data-cy="calander-end-date-not-lecture-not-input-lable"]',
        ).click();
        cy.get(
          '[data-cy="calendar-choose-date-right-arrow-date-picker"] > .fa-solid',
        ).click();
        cy.get('[data-cy="calendar-choose-date-day-20-date-picker"]').click();
        cy.get('[data-cy="calendar-event-save-confirm-button"]').click();

        cy.wait('@createCalendarEvent').then((interception) => {
          expect(interception?.response?.statusCode).to.eq(201);
          cy.log('Calendar Event Created Successfully!');
          createdEventId = interception.response?.body.id;
          cy.get(
            `[data-cy="calendar-event-${createdEventId}-month-id-month-item-isCourse"]`,
          ).click();
          /* ==== Generated with Cypress Studio ==== */
          cy.get('[data-cy="calendar-event-title-text-field"]').click();
          cy.get('[data-cy="calendar-event-title-text-field"]').click();
          cy.get('[data-cy="calendar-event-title-text-field"]').clear(
            'Meeting with OOP teacher',
          );
          cy.get('[data-cy="calendar-event-title-text-field"]').type(
            'Edited multiple event',
          );
          cy.get(
            '[data-cy="event-description-quill-editor"] > .ql-editor > p',
          ).click();
          cy.get(
            '[data-cy="calendar-event-save-confirm-button"] > .fa-light',
          ).click();
          cy.get(
            `[data-cy="calendar-event-footer-box-save-confirm"] > [data-cy="${deleteType}-delete-list"] > [data-cy="check-box-check-uncheck-button"] > .flex`,
          ).click();
          cy.get('[data-cy="calendar-event-onSave-button"]').click();
          /* ==== End Cypress Studio ==== */
          verifyEventAppearance();
        });
      });
    }

    function verifyEventAppearance() {
      cy.get('body').then(($body) => {
        if ($body.find(currentDateSelector).length > 0) {
          cy.get(currentDateSelector).within(() => {
            cy.contains('Edited multiple event').should('be.visible');
          });
        } else if ($body.find(nextDateSelector).length > 0) {
          cy.get(nextDateSelector).within(() => {
            cy.contains('Edited multiple event').should('be.visible');
          });
        } else {
          throw new Error('Event not found on either current or next date');
        }
      });
    }

    beforeEach(() => {
      setupCalendar();
    });

    it('should update an event with all daily frequency', () => {
      updateCreatedMultipleEvent('daily', 'all');
    });
    it('should update an event with this and following daily frequency', () => {
      updateCreatedMultipleEvent('daily', 'cascade');
    });
    it('should update an event with all weekly frequency', () => {
      updateCreatedMultipleEvent('weekly', 'all');
    });
    it('should update an event with this and following weekly frequency', () => {
      updateCreatedMultipleEvent('weekly', 'cascade');
    });
    it('should update an event with all monthly frequency', () => {
      updateCreatedMultipleEvent('monthly', 'all');
    });
    it('should update an event with this and following monthly frequency', () => {
      updateCreatedMultipleEvent('monthly', 'cascade');
    });

    afterEach(() => {
      if (createdCalendarId) {
        cy.request({
          method: 'DELETE',
          url: `${Cypress.env('apiBaseUrl')}/calendars/${createdCalendarId}`,
        }).then((response) => {
          expect(response.status).to.eq(200);
          cy.log('Deleted Calendar Successfully!');
        });
      }
    });
  });
});
