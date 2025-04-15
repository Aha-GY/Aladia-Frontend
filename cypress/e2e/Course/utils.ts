export const editSpaceContent = (imageFile: string): void => {
  cy.get('[data-cy="space-edit-content-name"]').click();
  cy.get('[data-cy="edit-space-content-name-text-field"]').click();
  cy.get('[data-cy="edit-space-content-name-text-field"]').click();
  cy.get('[data-cy="edit-space-content-name-text-field"]').clear();
  cy.get('[data-cy="edit-space-content-name-text-field"]').type(
    'Software development',
  );
  cy.get('.mb-3.cursor-pointer > .size-5').click();
  cy.get('[style="--pcr-color: rgba(183, 75, 70, 1)"]').click();
  cy.get('[data-cy="close-date-picker-button"]').click();
  cy.get('[data-cy="edit-space-content-icon-text-field"]').click();
  cy.get('[data-cy="6187430e250addeb"]').selectFile(imageFile, { force: true });
  cy.wait(5000);
  cy.get('[data-cy="a5dd7d30704d1cf5"]').click();
};

export const createFolder = (spaceId: string): void => {
  cy.get(`[data-cy="space-item-card-${spaceId}"] > .mb-1.w-full`).click();
  cy.get('[data-cy="new-folder-button"]').click();
  cy.get('[data-cy="sidebar-create-new-folder"]').click();
  cy.get('[data-cy="sidebar-create-new-folder-name-text-field"]').clear();
  cy.get('[data-cy="sidebar-create-new-folder-name-text-field"]').type(
    'Flutter{enter}',
  );
};

export const createLiveCourse = (
  _spaceId: string,
  folderId: string,
  _startDate: number,
  _endDate: number,
): void => {
  cy.get(`[data-cy="space-folder-${folderId}"]`).click();
  cy.get('[data-cy="11b7856e54488f2f"]').click();
  cy.get(
    '[data-cy="sidebar-new-course-folder-2"] > [data-cy="create-live-course-button"] > .mb-1 > [data-cy="open-live-course-datepicker"] > [data-cy="open-live-course-datepicker-mobile"]',
  ).click();
  cy.get(
    '.daterange > .pb-2\\.5 > .grid-cols-7 > [data-cy="open-live-course-from-folder-30-number-of-days-in-month-date-picker"] > [data-cy="open-live-course-from-folder-day-30-date-picker"]',
  )
    .eq(1)
    .click({ force: true });
  cy.get(
    '.daterange > .pb-2\\.5 > .mx-2 > [data-cy="open-live-course-from-folder-right-arrow-date-picker"]',
  )
    .eq(1)
    .click({ force: true });
  cy.get(
    '.daterange > .pb-2\\.5 > .mx-2 > [data-cy="open-live-course-from-folder-right-arrow-date-picker"]',
  )
    .eq(1)
    .click({ force: true });
  cy.get(
    '.daterange > .pb-2\\.5 > .mx-2 > [data-cy="open-live-course-from-folder-right-arrow-date-picker"]',
  )
    .eq(1)
    .click({ force: true });
  cy.get(
    '.daterange > .pb-2\\.5 > .mx-2 > [data-cy="open-live-course-from-folder-right-arrow-date-picker"]',
  )
    .eq(1)
    .click({ force: true });
  cy.get(
    '.daterange > .pb-2\\.5 > .mx-2 > [data-cy="open-live-course-from-folder-right-arrow-date-picker"]',
  )
    .eq(1)
    .click({ force: true });
  cy.get(
    '.daterange > .pb-2\\.5 > .mx-2 > [data-cy="open-live-course-from-folder-right-arrow-date-picker"]',
  )
    .eq(1)
    .click({ force: true });
  cy.get(
    '.daterange > .pb-2\\.5 > .mx-2 > [data-cy="open-live-course-from-folder-right-arrow-date-picker"]',
  )
    .eq(1)
    .click({ force: true });
  cy.get(
    '.daterange > .pb-2\\.5 > .mx-2 > [data-cy="open-live-course-from-folder-right-arrow-date-picker"]',
  )
    .eq(1)
    .click({ force: true });
  cy.get(
    '.daterange > .pb-2\\.5 > .mx-2 > [data-cy="open-live-course-from-folder-right-arrow-date-picker"]',
  )
    .eq(1)
    .click({ force: true });
  cy.get(
    '.daterange > .pb-2\\.5 > .grid-cols-7 > [data-cy="open-live-course-from-folder-28-number-of-days-in-month-date-picker"] > [data-cy="open-live-course-from-folder-day-28-date-picker"]',
  )
    .eq(1)
    .click({ force: true });
  cy.get('.daterange > .border-t > [data-cy="d39e163cd1512d0d"]')
    .eq(1)
    .click({ force: true });
  cy.get(
    '[data-cy="sidebar-new-course-folder-2"] > [data-cy="create-live-course-button"] > .text-white\\/50',
  ).click();
};

export const courseReccuringBilling = (_courseId: string): void => {
  cy.get('[data-cy="edit-billing-option"]').click();
  cy.get('[data-cy="payment-model"] > .flex').click();
  cy.get('[data-cy="reccuring-payment-option"] > .h-full').click();
  cy.get('[data-cy="total-price-input"]').type('200');
  cy.get('[data-cy="subscription-fee-input"]').type('5');
  cy.get('[data-cy="course-billing-frequency"] > .flex').click();
  cy.get('[data-cy="course-biling-frequency-week"]').click();
  cy.get('[data-cy="course-save-chapter-icon"] > .fa-light').click();
  cy.wait(2000);
  cy.get('[data-cy="course-save-chapter-icon"]').click();
  cy.wait(2000);
  cy.get(
    '[data-cy="org-hub-header-sidebar-header-builder"] > .w-0 > .gap-1 > [data-cy="0113bf7f9c21d4ef"]',
  ).click();
};

export const addCourseContent = (
  _courseId: string,
  _courseTitle: string,
  imageFile: string,
  _videoFile: string,
): void => {
  cy.wait(5000);
  cy.get('[data-cy="edit-course-detail"]').click();
  cy.get('[data-cy="edit-course-detail"]').click();

  cy.get('[data-cy="edit-course-title-text-field"]').click();
  cy.get('[data-cy="edit-course-title-text-field"]').clear();
  cy.get('[data-cy="edit-course-title-text-field"]').type('Flutter');

  cy.get(`[data-cy="upload-image-item"]`).click();
  cy.get(`[data-cy="upload-image-item"] input[type="file"]`).selectFile(
    imageFile,
  );
  cy.get('[data-cy="edit-course-language-text-field"]').click();
  -cy.get('[data-cy="edit-course-language-English"]').click();
  cy.get(
    '[data-cy="open-multiple-skills-select-button"] > .el-select > .el-select__wrapper',
  ).click();
  cy.get(
    '[data-cy="network-security-multiple-skills-option"] > [data-v-5fb80ee2=""]',
  ).click();
  cy.get('#space-main').click();
  cy.get('[data-cy="edit-course-requirement-add-text-field"]').click();
  cy.get('[data-cy="edit-course-requirement-add-text-field"]').type(
    'Cypress and PC',
  );
};

export const addcycles = (courseId: string): void => {
  cy.intercept(
    'POST',
    `${Cypress.env('apiBaseUrl')}/courses/${courseId}/cycles`,
  ).as('createCycle');
  cy.get('[data-cy="edit-course-cycle-add-2"]').click();
  cy.get('[data-cy="edit-course-cycle-start-1-text-field"]').click();
  cy.get(
    '[data-cy="calendar-choose-date-right-arrow-date-picker"] > .fa-solid',
  ).click();
  cy.get(
    '[data-cy="calendar-choose-date-right-arrow-date-picker"] > .fa-solid',
  ).click();
  cy.get(
    '[data-cy="calendar-choose-date-right-arrow-date-picker"] > .fa-solid',
  ).click();
  cy.get(
    '[data-cy="calendar-choose-date-right-arrow-date-picker"] > .fa-solid',
  ).click();
  cy.get(
    '[data-cy="calendar-choose-date-right-arrow-date-picker"] > .fa-solid',
  ).click();
  cy.get(
    '[data-cy="calendar-choose-date-right-arrow-date-picker"] > .fa-solid',
  ).click();
  cy.get(
    '[data-cy="calendar-choose-date-right-arrow-date-picker"] > .fa-solid',
  ).click();
  cy.get(
    '[data-cy="calendar-choose-date-right-arrow-date-picker"] > .fa-solid',
  ).click();
  cy.get(
    '[data-cy="calendar-choose-date-right-arrow-date-picker"] > .fa-solid',
  ).click();
  cy.get('[data-cy="calendar-choose-date-day-1-date-picker"]').click();
  cy.get('[data-cy="course-save-chapter-icon"]').click();
  cy.get(
    '[data-cy="org-hub-header-sidebar-header-builder"] > [data-cy="close-icon"]',
  ).click();
};

export const addTeacher = (
  orgId: string,
  spaceId: string,
  folderId: string,
  courseId: string,
  inviteLink: string,
): void => {
  cy.get(`[data-cy="organization-list-${orgId}"]`).click();
  cy.get(`[href="/organization/hub/${orgId}/spaces"]`).click();

  cy.get(`[data-cy="space-item-card-${spaceId}"] > .mb-1.w-full`).click();
  cy.get(`[data-cy="space-folder-list-${folderId}"]`).click();

  cy.wait(10000);
  cy.get('[data-cy="5bfbc4110c8f7ddc"] > .max-w-36').click();
  cy.get(`[data-cy="space-folder-list-${folderId}"]`).click();

  cy.get(`[data-cy="course-card-icon-${courseId}"] > .fa-regular`).click();
  cy.get(`[data-cy="open-builder-button-${courseId}"]`).click();
  cy.get('[data-cy="bca3668ba77631f5"] > .fa-solid').click();
  cy.get('[data-cy="0a09b53d26fccc72"]').click();
  cy.get(
    '[data-cy="role-options-list"] > .el-select__wrapper > .el-select__selection > .el-select__placeholder > span',
  ).click();
  cy.get('[data-cy="option-roles-course-teacher"]').click();

  cy.wait(10000);
  cy.get('[data-cy="invite-link"]')
    .invoke('text')
    .then((link) => {
      // Simulate copying the link by triggering the copy button
      cy.get('[data-cy="836b6e33d149dac7"]').click();

      // Visit the copied link
      inviteLink = link;

      cy.wrap(inviteLink).as('inviteLink');
    });
  cy.login('test-teacher-4@aladia.io', 'Pass@123');

  cy.wait(10000);

  cy.get('@inviteLink').then((inviteLink) => {
    cy.visit(
      inviteLink
        .toString()
        .replace('https://develop.aladia.io', 'http://localhost:3000'),
    );
  });

  cy.get('[data-cy="8e79003161c79fa2"]').click();

  cy.wait(10000);
  cy.login('test-scenario-org-1@aladia.io', Cypress.env('password'));
  cy.visitDesktop('/');

  cy.get(`[data-cy="organization-list-${orgId}"]`).click();
  cy.get(`[href="/organization/hub/${orgId}/spaces"]`).click();

  cy.get(`[data-cy="space-item-card-${spaceId}"] > .mb-1.w-full`).click();
};

export const createSubject = (folderId: string, courseId): void => {
  cy.get(`[data-cy="space-folder-list-${folderId}"]`).click();
  cy.get('[data-cy="8795cc83ac0bce94"]').click();

  cy.get(`[data-cy="space-folder-${folderId}"]`).click();

  cy.wait(10000);

  cy.get(`[data-cy="space-folder-${folderId}"]`).click();
  cy.get(`[data-cy="course-card-${courseId}"]`).click();

  cy.get('[data-cy="edit-content-icon"]').click();
  cy.wait(5000);
  cy.get('[data-cy="subject-toggler-edit-content"]').click();
  cy.get('[data-cy="subject-toggler-edit-content"]').click();
  cy.wait(5000);
  cy.get('[data-cy="subject-toggler-edit-content"]').click();

  cy.get('[data-cy="course-event-subject-add"]').click();
  cy.get('[data-cy="edit-subject-title-1-text-field"]').click();
  cy.get('[data-cy="edit-subject-title-1-text-field"]').clear();
  cy.get('[data-cy="edit-subject-title-1-text-field"]').type('GETTING STARTED');
  cy.get('[data-cy="subject-image-picker-tooltip"]').click();
  cy.get('[style="--pcr-color: rgba(119, 219, 137, 1)"]').click();
  cy.get('.pcr-color-palette').click();
  cy.get('.pcr-color-palette').click();
  cy.get('[data-cy="save-subjects-created"]').click();
  cy.get('[data-cy="save-subject-content-update"]').click();
};

export const addChapter = (): void => {
  cy.get('[data-cy="add-chapter-plus-icon"] > .fa-light').click();
  cy.get('[data-cy="add-chapter-plus-icon"] > .fa-light').click();
  cy.get('[data-cy="save-chapter-icon-popup"]').click();
};

export const addLectures = (chapterId: string): void => {
  cy.wait(5000);
  cy.get(`[data-cy="add-lecture-button-${chapterId}"]`).click();
  cy.wait(5000);
};

export const editLectureTitle = (
  lectureId: string,
  lectureTitle: string,
): void => {
  cy.get(`[data-cy="lecture-title-${lectureId}-text-field"]`).click();
  cy.get(`[data-cy="lecture-title-${lectureId}-text-field"]`).clear();
  cy.get(`[data-cy="lecture-title-${lectureId}-text-field"]`).type(
    lectureTitle,
  );
};

export const attachSubject = (lectureId: string, subjectId: string): void => {
  cy.get(
    `[data-cy="lecture-${lectureId}"] > .group\\/input > .gap-1 > .gap-2 > .hover\\:bg-white\\/5 > .fa-light`,
  ).click();
  cy.get('[data-cy="group-assign-subject"]').click();
  cy.get(`[data-cy="subject-list-${subjectId}"]`).click();
  cy.get('[data-cy="course-save-chapter-icon"]').click();
};

export const saveChapter = (): void => {
  cy.get('[data-cy="course-save-chapter-icon"]').click();
  cy.get(
    '[data-cy="org-hub-header-sidebar-header-builder"] > [data-cy="close-icon"] > .fa-light',
  ).click();
  cy.wait(5000);
};

export const publishCourse = (
  courseId: string,
  orgId: string,
  spaceId: string,
  folderId: string,
): void => {
  cy.get(`[data-cy="organization-list-${orgId}"]`).click();
  cy.get(`[href="/organization/hub/${orgId}/spaces"]`).click();

  cy.get(`[data-cy="space-item-card-${spaceId}"] > .mb-1.w-full`).click();
  cy.get(`[data-cy="space-folder-list-${folderId}"]`).click();

  cy.wait(10000);
  cy.get('[data-cy="5bfbc4110c8f7ddc"] > .max-w-36').click();
  cy.get(`[data-cy="space-folder-list-${folderId}"]`).click();

  cy.get(`[data-cy="course-card-icon-${courseId}"] > .fa-regular`).click();
  cy.get(`[data-cy="course-card-icon-${courseId}"] > .fa-regular`).click();
  cy.get(`[data-cy="open-builder-button-${courseId}"]`).click();
  cy.get('[data-cy="publish-button"] > span.text-sm').click();
  cy.get('.z-30 > .rounded-t > [data-cy="close-icon"]').click();
};

export const reviewCourse = (courseId: string): void => {
  cy.reviewCourse(courseId);
};

export const courseBilling = (courseId: string): void => {
  cy.get(`[data-cy="course-card-icon-${courseId}"] > .fa-regular`).click();
  cy.get(`[data-cy="open-builder-button-${courseId}"]`).click();
  cy.get('[data-cy="edit-billing-option"]').click();
  cy.get('[data-cy="payment-model"] > .flex').click();
  cy.get('[data-cy="reccuring-payment-option"] > .h-full').click();

  cy.get('[data-cy="total-price-input"]').clear();
  cy.get('[data-cy="total-price-input"]').type('200');
  cy.get('[data-cy="total-price-input"]').clear();
  cy.get('[data-cy="total-price-input"]').type('200');

  cy.get('[data-cy="subscription-fee-input"]').clear();
  cy.get('[data-cy="subscription-fee-input"]').type('5');
  cy.get('[data-cy="subscription-fee-input"]').clear();
  cy.get('[data-cy="subscription-fee-input"]').type('5');

  cy.get('[data-cy="course-billing-frequency"] > .flex').click();
  cy.get('[data-cy="course-biling-frequency-week"]').click();
  cy.get('[data-cy="course-save-chapter-icon"] > .fa-light').click();
  cy.get('[data-cy="course-save-chapter-icon"]').click();
  cy.wait(2000);
  cy.get('.z-40 > .mb-2 > [data-cy="close-icon"] > .fa-light').click();
};

export const addPayment = (): void => {
  cy.intercept('GET', `${Cypress.env('apiBaseUrl')}/payment/customers`).as(
    'paymentlist',
  );
  cy.intercept(
    'POST',
    `${Cypress.env('apiBaseUrl')}/payment/customers/payment-methods`,
  ).as('paymentmethods');
  cy.intercept('GET', 'https://js.stripe.com/v3/.deploy_status_henson.json').as(
    'stripeDeployStatus',
  );

  cy.get(
    '[data-cy="header-avatar"] > .group\\/avatar > .cursor-pointer > .relative > .bg-black > .flex',
  ).click();

  cy.get('[data-cy="Payments-list"]').click();
  cy.wait('@paymentlist');
  cy.wait('@stripeDeployStatus');
  cy.wait(5000);
  cy.get('[data-cy="add-payment-method"]').click();
  cy.get('iframe[name^="__privateStripeFrame"]')
    .should('be.visible')
    .its('0.contentDocument')
    .should('exist')
    .its('body')
    .should('not.be.empty')
    .then(($body) => {
      cy.wrap($body).find('input[name="number"]').type('4242424242424242');
      cy.wrap($body).find('input[name="expiry"]').type('12/34');
      cy.wrap($body).find('input[name="cvc"]').type('123');
    });
  cy.get('[data-cy="add-new-card"]').click();
  cy.wait(5000);
  cy.wait('@paymentmethods');
  cy.get('[data-cy="close-profile-setting-drawer"]').click();
};
