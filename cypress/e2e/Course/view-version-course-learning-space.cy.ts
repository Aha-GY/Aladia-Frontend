context('Desktop Viewport (1200 x 800)', () => {
  let courseId;
  let spaceId;

  beforeEach(() => {
    cy.viewport(1200, 800);

    // Ensure login is completed before each test
    cy.login(Cypress.env('TEST_USER_EMAIL'), Cypress.env('TEST_USER_PASSWORD'));
  });
  /* ==== Test Created with Cypress Studio ==== */
  it('view version of a course from the learning space on desktop', () => {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiBaseUrl')}/spaces`,
    })
      .then((response) => {
        const spaces = response.body.data;
        expect(spaces, 'Expected spaces data to be available').to.exist;
        spaceId = spaces[0].id;
      })
      .then(() => {
        cy.visitDesktop('/');
        cy.intercept('POST', `${Cypress.env('apiBaseUrl')}/courses`).as(
          'createCourse',
        );
        /* ==== Generated with Cypress Studio ==== */

        cy.get(
          '[data-cy="sidebar-space-icon"] > .v-touch-ripple > .flex > .fa-solid',
        )
          .should('be.visible')
          .click();

        cy.get(`[data-id="${spaceId}"]`).click();
        cy.get('[data-cy="new-folder-button"]').should('be.visible').click();
        cy.get('[data-cy="new-course-button"]').should('be.visible').click();
        cy.get('[data-cy="on-demand-button"] > .text-xs')
          .should('be.visible')
          .click();

        cy.get('.z-30 > .rounded-t > [data-cy="close-icon"]').click();

        cy.wait('@createCourse').then((interception) => {
          expect(interception.response).to.exist;
          expect(interception.response.statusCode).to.equal(201);

          courseId = interception.response.body.id;
          cy.log('Created Course ID:', courseId);
          expect(courseId).to.exist;
          // to check the course is created
          cy.get(`[data-cy="course-card-icon-${courseId}"]`).should('exist');
          cy.get(`[data-cy="course-card-icon-${courseId}"]`).click();
          cy.get(`[data-cy="open-builder-button-${courseId}"]`).click();
          cy.get('[data-cy="course-version-label"] ').click();
          cy.get('[data-cy="version-menu-icon"]').click();
          cy.get('[data-cy="view-version-button"]').click();
          /* ==== End Cypress Studio ==== */
        });
      });
  });
  afterEach(() => {
    if (courseId) {
      cy.request({
        method: 'DELETE',
        url: `${Cypress.env('apiBaseUrl')}/courses/${courseId}`,
      });
    }
  });
});
