import {
  courseReccuringBilling,
  addCourseContent,
  addChapter,
  addLectures,
  editSpaceContent,
  publishCourse,
  reviewCourse,
  createLiveCourse,
  addcycles,
  createFolder,
  editLectureTitle,
  saveChapter,
  addTeacher,
  createSubject,
  attachSubject,
} from './utils';

context('Desktop Viewport (1200 x 800)', () => {
  let courseId;
  let spaceId;
  let lectureId;
  let chapterId;
  let orgId;
  let folderId;
  let inviteLink;
  let subjectId;
  const courseTitle = 'Introduction to flutter';
  const imageFile = 'cypress/fixtures/space.jpg';
  const videoFile = 'cypress/fixtures/mov_bbb.mp4';

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
    cy.login('test-scenario-org-1@aladia.io', Cypress.env('password'));
    cy.visitDesktop('/');
    cy.getCookie('myOrganizationList').then((contextCookie) => {
      const decodedValue = decodeURIComponent(contextCookie.value);
      const orgIds = JSON.parse(decodedValue);
      orgId = orgIds[0];
      console.log(orgIds[0]);
    });
  });

  it('Publish a course from the teaching space on desktop', () => {
    cy.get(`[data-cy="organization-list-${orgId}"]`).click();
    cy.get(`[href="/organization/hub/${orgId}/spaces"]`).click();

    cy.intercept('POST', `${Cypress.env('apiBaseUrl')}/spaces`).as(
      'createSpace',
    );
    cy.intercept('POST', `${Cypress.env('apiBaseUrl')}/courses`).as(
      'createCourse',
    );

    // Step - 1 create a space
    cy.get('[data-cy="new-space-icon"]').click();

    cy.wait('@createSpace').then((interception) => {
      expect(interception.response).to.exist;
      expect(interception.response.statusCode).to.equal(201);
      spaceId = interception.response.body.id;

      expect(spaceId).to.exist;

      cy.intercept(
        'POST',
        `${Cypress.env('apiBaseUrl')}/spaces/${spaceId}/folders`,
      ).as('createFolder');

      // Step - 2 edit space content
      editSpaceContent(imageFile);
      cy.get('[data-cy="course-space-label"] > .fa-light').click();

      createFolder(spaceId);

      cy.wait('@createFolder').then((interception) => {
        expect(interception.response).to.exist;
        expect(interception.response.statusCode).to.equal(201);

        folderId = interception.response.body.id;

        expect(folderId).to.exist;

        createLiveCourse(spaceId, folderId, 1, 1);

        cy.wait('@createCourse').then((interception) => {
          expect(interception.response).to.exist;
          expect(interception.response.statusCode).to.equal(201);

          courseId = interception.response.body.id;
          cy.log('Created Course ID:', courseId);
          expect(courseId).to.exist;

          courseReccuringBilling(courseId);

          addCourseContent(courseId, courseTitle, imageFile, videoFile);

          addcycles(courseId);

          cy.intercept(
            'POST',
            `${Cypress.env('apiBaseUrl')}/courses/${courseId}/subjects`,
          ).as('createSubject');

          cy.intercept(
            'POST',
            `${Cypress.env('apiBaseUrl')}/courses/${courseId}/chapters`,
          ).as('createChapter');

          addTeacher(orgId, spaceId, folderId, courseId, inviteLink);

          createSubject(folderId, courseId);

          addChapter();

          cy.wait('@createSubject').then((interception) => {
            subjectId = interception.response.body.id;
            expect(interception.response).to.exist;

            expect(interception.response.statusCode).to.equal(201);

            expect(subjectId).to.exist;

            cy.wait('@createChapter').then((interception) => {
              expect(interception.response).to.exist;
              expect(interception.response.statusCode).to.equal(201);

              chapterId = interception.response.body.id;

              expect(chapterId).to.exist;

              cy.intercept(
                'POST',
                `${Cypress.env('apiBaseUrl')}/courses/${courseId}/chapters/${chapterId}/lectures`,
              ).as('createLecture');

              addLectures(chapterId);
              cy.wait('@createLecture').then((interception) => {
                lectureId = interception.response.body.id;
                editLectureTitle(lectureId, 'Dart programming language');
                attachSubject(lectureId, subjectId);
              });
              addLectures(chapterId);
              cy.wait('@createLecture').then((interception) => {
                lectureId = interception.response.body.id;
                editLectureTitle(lectureId, 'Widgets and screens');
                attachSubject(lectureId, subjectId);
              });

              addLectures(chapterId);
              cy.wait('@createLecture').then((interception) => {
                lectureId = interception.response.body.id;
                editLectureTitle(lectureId, 'Widgets and screens');
                attachSubject(lectureId, subjectId);
              });

              addChapter();

              cy.wait('@createChapter').then((interception) => {
                expect(interception.response).to.exist;
                expect(interception.response.statusCode).to.equal(201);

                chapterId = interception.response.body.id;

                expect(chapterId).to.exist;

                cy.intercept(
                  'POST',
                  `${Cypress.env('apiBaseUrl')}/courses/${courseId}/chapters/${chapterId}/lectures`,
                ).as('createLecture');

                addLectures(chapterId);
                cy.wait('@createLecture').then((interception) => {
                  lectureId = interception.response.body.id;
                  editLectureTitle(lectureId, 'Dart programming language');
                  attachSubject(lectureId, subjectId);
                });
                addLectures(chapterId);
                cy.wait('@createLecture').then((interception) => {
                  lectureId = interception.response.body.id;
                  editLectureTitle(lectureId, 'Widgets and screens');
                  attachSubject(lectureId, subjectId);
                });

                addLectures(chapterId);
                cy.wait('@createLecture').then((interception) => {
                  lectureId = interception.response.body.id;
                  editLectureTitle(lectureId, 'Widgets and screens');
                  attachSubject(lectureId, subjectId);
                });

                addChapter();

                cy.wait('@createChapter').then((interception) => {
                  expect(interception.response).to.exist;
                  expect(interception.response.statusCode).to.equal(201);

                  chapterId = interception.response.body.id;

                  expect(chapterId).to.exist;

                  cy.intercept(
                    'POST',
                    `${Cypress.env('apiBaseUrl')}/courses/${courseId}/chapters/${chapterId}/lectures`,
                  ).as('createLecture');

                  addLectures(chapterId);
                  cy.wait('@createLecture').then((interception) => {
                    lectureId = interception.response.body.id;
                    editLectureTitle(lectureId, 'Dart programming language');
                    attachSubject(lectureId, subjectId);
                  });
                  addLectures(chapterId);
                  cy.wait('@createLecture').then((interception) => {
                    lectureId = interception.response.body.id;
                    editLectureTitle(lectureId, 'Widgets and screens');
                    attachSubject(lectureId, subjectId);
                  });

                  addLectures(chapterId);
                  cy.wait('@createLecture').then((interception) => {
                    lectureId = interception.response.body.id;
                    editLectureTitle(lectureId, 'Widgets and screens');
                    attachSubject(lectureId, subjectId);
                  });
                });
              });
            });
          });

          saveChapter();

          reviewCourse(courseId);
          publishCourse(courseId, orgId, spaceId, folderId);
        });
      });
    });
  });

  afterEach(() => {
    deleteCourse();
    deleteSpace();
  });
});
