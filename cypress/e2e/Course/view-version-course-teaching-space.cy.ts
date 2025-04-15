describe('Create Course in Learning Space', () => {
  context('Desktop Viewport (1200 x 800)', () => {
    let courseId;
    let spaceId;
    function deleteCourse() {
      if (courseId) {
        cy.request({
          method: 'DELETE',
          url: `${Cypress.env('apiBaseUrl')}/courses/${courseId}`,
        }).then((response) => {
          expect(response.status).to.eq(200);
          courseId = null;
        });
      }
    }
    function deleteSpace() {
      if (spaceId) {
        cy.request({
          method: 'DELETE',
          url: `${Cypress.env('apiBaseUrl')}/spaces/${spaceId}`,
        }).then((response) => {
          expect(response.status).to.eq(200);
          spaceId = null;
        });
      }
    }

    beforeEach(() => {
      cy.viewport(1200, 800);

      // Log in
      cy.login(
        Cypress.env('TEST_TEACHER_USER_EMAIL'),
        Cypress.env('TEST_TEACHER_USER_PASSWORD'),
      );
    });
    /* ==== Test Created with Cypress Studio ==== */
    it('view version of a course from the teaching space on desktop', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.env('apiBaseUrl')}/spaces`,
      }).then(() => {
        cy.visitDesktop('/');
        cy.intercept('POST', `${Cypress.env('apiBaseUrl')}/courses`).as(
          'createCourse',
        );
        /* ==== Generated with Cypress Studio ==== */
        cy.get('[data-cy="sidebar-space-icon"]').should('be.visible').click();
        cy.get('[data-cy="new-space-icon"]').click();
        cy.get('[data-cy="edit-folder-icon"]').click();
        cy.get('[data-cy="new-course-button"]').click();
        cy.get('[data-cy="on-demand-button"] > .text-xs')
          .should('be.visible')
          .click();

        cy.get('.z-30 > .rounded-t > [data-cy="close-icon"]').click();

        // Capture the created course and space IDs
        cy.wait('@createCourse').then((interception) => {
          expect(interception.response).to.exist;
          expect(interception.response.statusCode).to.eq(201);

          courseId = interception.response.body.id;
          spaceId = interception.response.body.spaceId;

          cy.get(`[data-id="${spaceId}"]`).click();
          // Verify the course exists
          cy.get(`[data-cy="course-card-icon-${courseId}"]`).should('exist');
          cy.get(`[data-cy="course-card-icon-${courseId}"]`).click();
          cy.get(`[data-cy="open-builder-button-${courseId}"]`).click();
          cy.get('[data-cy="course-version-label"]').click();
          cy.get('[data-cy="version-menu-icon"]').click();
          cy.get('[data-cy="view-version-button"]').click();
          /* ==== End Cypress Studio ==== */
        });
      });
    });

    afterEach(() => {
      deleteCourse();
      deleteSpace();
    });
  });
});
