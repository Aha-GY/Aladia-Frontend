Cypress.Commands.add('reviewCourse', (courseId: string) => {
  cy.login(
    Cypress.env('TEST_SUPER_ADMIN_USER_EMAIL'),
    Cypress.env('TEST_SUPER_ADMIN_USER_PASSWORD'),
  );
  return cy
    .request({
      method: 'PATCH',
      url: `${Cypress.env('apiBaseUrl')}/courses/${courseId}/review`,
      body: {
        status: 'published',
      },
    })
    .then((response) => response.status === 200);
});
