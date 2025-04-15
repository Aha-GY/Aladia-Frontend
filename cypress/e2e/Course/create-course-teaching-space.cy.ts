context('Desktop Viewport (1200 x 800)', () => {
  let courseId;
  let spaceId;

  beforeEach(() => {
    cy.viewport(1200, 800);
    cy.login(
      Cypress.env('TEST_TEACHER_USER_EMAIL'),
      Cypress.env('TEST_TEACHER_USER_PASSWORD'),
    );
  });

  it('Create course in learning space on desktop', () => {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('apiBaseUrl')}/spaces`,
    }).then(() => {
      cy.visitDesktop('/');

      cy.intercept('POST', `${Cypress.env('apiBaseUrl')}/courses`).as(
        'createCourse',
      );
      cy.get(
        '[data-cy="sidebar-space-icon"] > .v-touch-ripple > .flex > .fa-solid',
      ).should('be.visible');
      cy.get(
        '[data-cy="sidebar-space-icon"] > .v-touch-ripple > .flex > .fa-solid',
      ).click();
      cy.get('[data-cy="new-space-icon"]').click();
      cy.get('[data-cy="edit-folder-icon"] > :nth-child(2) > .gap-3').click();
      cy.get('[data-cy="new-course-button"]').click();
      cy.get('[data-cy="on-demand-button"] > .mb-1').click();
      cy.get('.z-30 > .rounded-t > [data-cy="close-icon"]').click();
      cy.wait('@createCourse').then((interception) => {
        expect(interception.response).to.exist;
        expect(interception.response.statusCode).to.equal(201);

        courseId = interception.response.body.id;
        spaceId = interception.response.body.spaceId;
        expect(courseId).to.exist;
        expect(spaceId).to.exist;
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
