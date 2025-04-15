describe('Edit calendar ', () => {
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
    it('Desktop Home page is ready with logged-in user and Edits a calendar', () => {
      cy.visitDesktop(`/user/hub/${userId}/calendar`);
      cy.get(
        `[data-cy="${createdCalendarId}-list-of-calanders-three-dots"] > .fa-light`,
      )
        .should('be.visible')
        .click({ force: true });
      /* ==== Generated with Cypress Studio ==== */
      cy.get('[data-cy="calendar-edit-popup-button"]').click();
      cy.get('[data-cy="calendar-sidebar-on-add-detail-box"]').click();
      cy.get('[data-cy="calendar-title-text-field"]').clear('calendar');
      cy.get('[data-cy="calendar-title-text-field"]').type('Edited Calendar');
      cy.get('[data-cy="calendar-theme-color-text-field"]').click();
      cy.get('[style="--pcr-color: rgba(183, 75, 70, 1)"]').click();
      cy.get('[data-cy="calendar-base-event-duration-text-field"]').click();
      cy.get('[data-cy="60-label"]').click();
      cy.get('[data-cy="calendar-time-zone-text-field"]').click();
      cy.get('[data-cy="4-time-zone"]').click();
      cy.get('[data-cy="calendar-save-button"]').click();
      cy.get('[data-cy="calendar-sidebar-close-icon"]').click();
      /* ==== End Cypress Studio ==== */
      cy.get(`[data-cy="${createdCalendarId}-list-of-calanders-name"]`).within(
        () => {
          cy.contains('Edited Calendar'); // Searches for the edited text within the specified calendar
        },
      );
    });
    afterEach(() => {
      // Clean up: Delete the created,edited calendar if it exists
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
