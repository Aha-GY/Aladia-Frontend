context('Desktop Viewport (1200 x 800)', () => {
  let courseId;
  let spaceId;

  beforeEach(() => {
    cy.viewport(1200, 800);

    // Ensure login is completed before each test
    cy.login(
      Cypress.env('TEST_TEACHER_USER_EMAIL'),
      Cypress.env('TEST_TEACHER_USER_PASSWORD'),
    );
  });
  /* ==== Test Created with Cypress Studio ==== */
  it('Create a chapter on a course from the teaching space on desktop', () => {
    cy.visitDesktop('/');
    cy.intercept('POST', `${Cypress.env('apiBaseUrl')}/spaces`).as(
      'createSpace',
    );
    cy.intercept('POST', `${Cypress.env('apiBaseUrl')}/courses`).as(
      'createCourse',
    );

    /* ==== Generated with Cypress Studio ==== */

    cy.get(
      '[data-cy="sidebar-space-icon"] > .v-touch-ripple > .flex > .fa-solid',
    )
      .should('be.visible')
      .click();
    cy.get('[data-cy="new-space-icon"]').click();
    cy.wait('@createSpace').then((interception) => {
      expect(interception.response).to.exist;
      expect(interception.response.statusCode).to.equal(201);

      spaceId = interception.response.body.id;
      cy.log('Created Space ID:', spaceId);
      expect(spaceId).to.exist;

      cy.get('[data-cy="course-space-label"] > .fa-light').click();

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
        cy.get(`[data-cy="course-card-icon-${courseId}"]`).click();
        cy.get(
          `[data-cy="course-card-icon-${courseId}"] > .fa-regular`,
        ).click();
        cy.get(`[data-cy="open-builder-button-${courseId}"]`).click();
        cy.get('[data-cy="edit-content-icon"]').click();
        cy.get('[data-cy="add-chapter-plus-icon"] > .fa-light').click();
        cy.get('[data-cy="save-chapter-icon"]').click();
        cy.get('[data-cy="close-chapter-icon"] > .fa-light').click();
        cy.get('.z-40 > .rounded-t > [data-cy="close-icon"]').click();
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
    if (spaceId) {
      cy.request({
        method: 'DELETE',
        url: `${Cypress.env('apiBaseUrl')}/spaces/${spaceId}`,
      });
    }
  });
});
