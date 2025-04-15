describe('Profile setup and customization', () => {
  const defaultUser = {
    bio: null,
    phoneNumber: ',it,39',
    timezone: '',
    birthAddress: {
      city: '',
      state: '',
      country: '',
    },
    address: {
      country: '',
      state: '',
      city: '',
      zipCode: '',
      streetAddress: '',
    },
    birthDate: null,
    about: '',
    cover: null,
    picture: null,
    status: null,
    socialLinks: [],
  };

  const experienceIds = {
    work: '',
    education: '',
    certificate: '',
  };

  function resetToDefaultProfile() {
    cy.request({
      method: 'PATCH',
      url: `${Cypress.env('apiBaseUrl')}/profiles/`,
      body: defaultUser,
      failOnStatusCode: false,
    });
  }

  function deleteExperience(experienceId) {
    cy.request({
      method: 'DELETE',
      url: `${Cypress.env('apiBaseUrl')}/profiles/me/experiences/${experienceId}`,
      failOnStatusCode: false,
    });
  }

  context('Desktop Viewport (1400 x 800)', () => {
    beforeEach(() => {
      cy.viewport(1400, 800);
      cy.login(
        Cypress.env('TEST_USER_EMAIL'),
        Cypress.env('TEST_USER_PASSWORD'),
      );
      resetToDefaultProfile();
      cy.visitDesktop('/');
    });

    afterEach(() => {
      cy.login(
        Cypress.env('TEST_USER_EMAIL'),
        Cypress.env('TEST_USER_PASSWORD'),
      );
      resetToDefaultProfile();
      experienceIds.work && deleteExperience(experienceIds.work);
      experienceIds.education && deleteExperience(experienceIds.education);
      experienceIds.certificate && deleteExperience(experienceIds.certificate);
      cy.getUserId().then((userId) => {
        cy.login(
          Cypress.env('TEST_USER_EMAIL_1'),
          Cypress.env('TEST_USER_PASSWORD_1'),
        );
        cy.request({
          method: 'POST',
          url: `${Cypress.env('apiBaseUrl')}/followers/${userId}/follow`,
          body: {
            followeeType: 'profile',
          },
        }).then((response) => {
          if (response.body.followed) {
            cy.request({
              method: 'POST',
              url: `${Cypress.env('apiBaseUrl')}/followers/${userId}/follow`,
              body: {
                followeeType: 'profile',
              },
            });
          }
        });
      });
    });

    it('Test User Journey in setting up profile', () => {
      cy.get('[data-cy="profile-side-bar-item"]').click();
      testWorkExperienceDesktop();
      testEducationexperienceDesktop();
      testCertificateExperienceDesktop();
      testAboutMeDesktop();

      cy.intercept({
        method: 'PATCH',
        url: `${Cypress.env('apiBaseUrl')}/profiles`,
      }).as('profileUpdate');

      testEditPersonalInfoDesktop();
      testAvatarAndCoverDesktop();
      testSocialLinksDesktop();
      testFollowDesktop();
    });

    function testWorkExperienceDesktop() {
      cy.intercept({
        method: 'POST',
        url: `${Cypress.env('apiBaseUrl')}/profiles/me/experiences`,
      }).as('addWorkExperience');

      cy.get('[data-cy="work-experience-add-button"]').click();
      cy.get('[data-cy="work-job-role-text-field"]').clear();
      cy.get('[data-cy="work-job-role-text-field"]').type('QA engineer');
      cy.get(
        '[data-cy="quality-assurance-engineer-(qa-engineer)-option"]',
      ).click();
      cy.get('[data-cy="work-authority-text-field"]').clear();
      cy.get('[data-cy="work-authority-text-field"]')
        .should('be.visible')
        .type('Test CI-CD Organization');
      cy.get('[data-cy="test-ci-cd-organization-option"]').click();
      cy.get('[data-cy="work-job-type-text-field"]').click();
      cy.get('[data-cy="remote-option"').click();
      cy.get('[data-cy="work-address-text-field"]').clear();
      cy.get('[data-cy="work-address-text-field"]').type('Italy');
      cy.get('[data-cy="italy-option"] > .flex').click();
      cy.get('[data-cy="work-contract-type-text-field"]').click();
      cy.get('[data-cy="fullTime-option"]').click();
      cy.get('[data-cy="open-multiple-skills-select-button"]').click();
      cy.get('[data-cy="search-multiple-skills-text-field"]').clear();
      cy.get('[data-cy="search-multiple-skills-text-field"]').type('QA');
      cy.get('[data-cy="qa-multiple-skills-option"]').click({ force: true });
      cy.get('.el-select__selection').click();
      cy.get('[data-cy="work-start-month-text-field"]').click({
        force: true,
      });
      cy.get('[data-cy="start-month-2-option"]').click();
      cy.get('[data-cy="work-start-year-text-field"]').click();
      cy.get('[data-cy="start-year-2021-option"]').click();
      cy.get('[data-cy="all-day-event-checkbox"]').click();
      cy.get('[data-cy="work-description-quill-editor-textarea"]').click();
      cy.get('[data-cy="work-description-quill-editor-textarea"]').type(
        'This is a test description',
      );
      cy.get('[data-cy="personal-save-changes-button"]').click();
      cy.wait('@addWorkExperience').then((interception) => {
        experienceIds.work = interception.response.body.id;
      });
    }

    function testEducationexperienceDesktop() {
      cy.intercept({
        method: 'POST',
        url: `${Cypress.env('apiBaseUrl')}/profiles/me/experiences`,
      }).as('addEducationExperience');

      cy.get('[data-cy="education-experience-add-button"]').click();
      cy.get('[data-cy="study-authority-text-field"]').clear();
      cy.get('[data-cy="study-authority-text-field"]')
        .should('be.visible')
        .type('Test CI-CD Organization');
      cy.get('[data-cy="study-authority-text-field"]').clear();
      cy.get('[data-cy="study-authority-text-field"]')
        .should('be.visible')
        .type('Test CI-CD Organization');
      cy.get('[data-cy="test-ci-cd-organization-option"]').click();
      cy.get('[data-cy="study-degree-text-field"]').clear();
      cy.get('[data-cy="study-degree-text-field"]').type(
        'Bachelor of science in computer',
      );
      cy.get(
        '[data-cy="bachelor-of-science-in-computer-science-option"] > .flex',
      ).click();
      cy.get('[data-cy="study-field-text-field"]').clear();
      cy.get('[data-cy="study-field-text-field"]').type('Computer Science');
      cy.get('[data-cy="study-address-text-field"]').clear();
      cy.get('[data-cy="study-address-text-field"]').type('Italy');
      cy.get('[data-cy="italy-option"] > .flex').click();
      cy.get('.el-select__wrapper').click();
      cy.get('[data-cy="search-multiple-skills-text-field"]').clear();
      cy.get('[data-cy="search-multiple-skills-text-field"]').type(
        'Computer Networking',
      );
      cy.get('[data-cy="computer-networking-multiple-skills-option"]').click();
      cy.get('.el-select__selection').click();
      cy.get('[data-cy="study-start-month-text-field"]').click({
        force: true,
      });
      cy.get('[data-cy="start-month-1-option"] > [data-cy="1-label"]').click();
      cy.get('[data-cy="study-start-year-text-field"]').click();
      cy.get('[data-cy="start-year-2017-option"]').click();
      cy.get('[data-cy="study-end-month-text-field"]').click();
      cy.get('[data-cy="end-month-1-option"] > [data-cy="1-label"]').click();
      cy.get('[data-cy="study-end-year-text-field"]').click();
      cy.get('[data-cy="end-year-2021-option"]').click();
      cy.get('[data-cy="study-description-quill-editor-textarea"]').click();
      cy.get('[data-cy="study-description-quill-editor-textarea"]').click();
      cy.get('[data-cy="personal-save-changes-button"]').click();
      cy.wait('@addEducationExperience').then((interception) => {
        experienceIds.education = interception.response.body.id;
      });
    }

    function testCertificateExperienceDesktop() {
      cy.intercept({
        method: 'POST',
        url: `${Cypress.env('apiBaseUrl')}/profiles/me/experiences`,
      }).as('addCertificateExperience');

      cy.get('[data-cy="certificate-experience-add-button"]').click();
      cy.get('[data-cy="certificate-name-text-field"]').clear();
      cy.get('[data-cy="certificate-name-text-field"]').type('Microsoft Azure');
      cy.get('[data-cy="certificate-authority-text-field"]').clear();
      cy.get('[data-cy="certificate-authority-text-field"]')
        .should('be.visible')
        .type('Test CI-CD Organization');
      cy.get('[data-cy="test-ci-cd-organization-option"] > .flex').click();
      cy.get('[data-cy="certificate-link-text-field"]').clear();
      cy.get('[data-cy="certificate-link-text-field"]').type('www.example.com');
      cy.get('.el-select__wrapper').click();
      cy.get('[data-cy="search-multiple-skills-text-field"]').clear();
      cy.get('[data-cy="search-multiple-skills-text-field"]').type(
        'Computer Networking',
      );
      cy.get('[data-cy="computer-networking-multiple-skills-option"]').click();
      cy.get('[data-cy="search-multiple-skills-text-field"]').clear({
        force: true,
      });
      cy.get('[data-cy="search-multiple-skills-text-field"]').type('cloud');
      cy.get('[data-cy="cloud-computing-multiple-skills-option"]').click({
        force: true,
      });
      cy.get('.el-select__selection').click({ force: true });
      cy.get('[data-cy="certificate-start-month-text-field"]').click({
        force: true,
      });
      cy.get('[data-cy="start-month-2-option"] > [data-cy="2-label"]').click();
      cy.get('[data-cy="certificate-start-year-text-field"]').click();
      cy.get('[data-cy="start-year-2022-option"]').click();
      cy.get('[data-cy="certificate-end-month-text-field"]').click();
      cy.get('[data-cy="end-month-2-option"]').click();
      cy.get('[data-cy="certificate-end-year-text-field"]').click();
      cy.get('[data-cy="end-year-2023-option"]').click();
      cy.get(
        '[data-cy="certificate-description-quill-editor-textarea"] > .ql-editor',
      ).click();
      cy.get('[data-cy="personal-save-changes-button"]').click();
      cy.wait('@addCertificateExperience').then((interception) => {
        experienceIds.certificate = interception.response.body.id;
      });
    }

    function testAboutMeDesktop() {
      cy.get('[data-cy="edit-about-button"]').click();
      cy.get('[data-cy="about-description-quill-editor-textarea"]').click();
      cy.get('[data-cy="about-description-quill-editor-textarea"]').type(
        'This is a test about me.',
      );
      cy.get('[data-cy="personal-save-changes-button"]').click();
    }

    function testEditPersonalInfoDesktop() {
      cy.get(
        '.mr-\\[1\\.125rem\\] > :nth-child(1) > [data-cy="ProfileInfo-list"]',
      ).click();
      cy.get('[data-cy="profile-edit-phone-number-text-field"]').clear();
      cy.get('[data-cy="profile-edit-phone-number-text-field"]').type(
        '0612345678',
      );
      cy.get('[data-cy="profile-edit-bio-text-field"]').clear();
      cy.get('[data-cy="profile-edit-bio-text-field"]').type(
        'Hi, this is test bio.',
      );
      cy.get(
        '[data-cy="profile-edit-current-location-country-select-toggle"]',
      ).click();
      cy.get(
        '[data-cy="search-profile-edit-current-location-country-text-field"]',
      ).clear({ force: true });
      cy.get(
        '[data-cy="search-profile-edit-current-location-country-text-field"]',
      ).type('ethiopia');
      cy.get(
        '[data-cy="profile-edit-current-location-ET-country-option"] > .text-sm',
      ).click();
      cy.get(
        '[data-cy="profile-edit-current-location-state-select-toggle"]',
      ).click();
      cy.get(
        '[data-cy="search-profile-edit-current-location-state-text-field"]',
      ).clear({ force: true });
      cy.get(
        '[data-cy="search-profile-edit-current-location-state-text-field"]',
      ).type('addis');
      cy.get(
        '[data-cy="profile-edit-current-location-state-Addis Ababa-option"]',
      ).click();
      cy.get(
        '[data-cy="profile-edit-current-location-city-select-toggle"]',
      ).click();
      cy.get(
        '[data-cy="search-profile-edit-current-location-city-text-field"]',
      ).clear({ force: true });
      cy.get(
        '[data-cy="search-profile-edit-current-location-city-text-field"]',
      ).type('addis');
      cy.get(
        '[data-cy="profile-edit-current-location-city-Addis Ababa-option"]',
      ).click();
      cy.get(
        '[data-cy="profile-edit-birth-location-country-select-toggle"]',
      ).click();
      cy.get(
        '[data-cy="search-profile-edit-birth-location-country-text-field"]',
      ).clear({ force: true });
      cy.get(
        '[data-cy="search-profile-edit-birth-location-country-text-field"]',
      ).type('ethiopia');
      cy.get(
        '[data-cy="profile-edit-birth-location-ET-country-option"]',
      ).click();
      cy.get(
        '[data-cy="profile-edit-birth-location-state-select-toggle"]',
      ).click();
      cy.get(
        '[data-cy="search-profile-edit-birth-location-state-text-field"]',
      ).clear({ force: true });
      cy.get(
        '[data-cy="search-profile-edit-birth-location-state-text-field"]',
      ).type('oromia');
      cy.get(
        '[data-cy="profile-edit-birth-location-state-Oromia Region-option"]',
      ).click();
      cy.get(
        '[data-cy="profile-edit-birth-location-city-select-toggle"]',
      ).click();
      cy.get(
        '[data-cy="search-profile-edit-birth-location-city-text-field"]',
      ).clear({ force: true });
      cy.get(
        '[data-cy="search-profile-edit-birth-location-city-text-field"]',
      ).type('bishof');
      cy.get(
        '[data-cy="profile-edit-birth-location-city-Bishoftu-option"]',
      ).click();
      cy.get('[data-cy="profile-edit-birth-date-text-field"]').click();
      cy.get('[data-cy="profile-edit-birth-date-text-field"]').click();
      cy.get('[data-cy="profile-edit-birth-date-day-2-date-picker"]').click();
      cy.get('[data-cy="personal-save-changes-button"]').click();
      cy.wait('@profileUpdate');
    }

    function testAvatarAndCoverDesktop() {
      // cy.get('[data-cy="edit-profile-avatar-image-button"]').click();
      cy.fixture('background.jpg', null).as('backgroundImage');
      cy.fixture('profile-picture.jpg', null).as('profileImage');

      cy.intercept({
        method: 'POST',
        url: `${Cypress.env('apiBaseUrl')}/storage/files/signed-upload`,
      }).as('signedUpload');
      cy.intercept({
        method: 'PUT',
        url: `https://storage.googleapis.com/**`,
      }).as('uploadImage');

      cy.get('[data-cy="edit-cover-image-editor-open-button"]').click({
        force: true,
      });
      cy.get('[data-cy="edit-cover-image-editor"]').selectFile(
        '@backgroundImage',
        {
          force: true,
        },
      );
      cy.get('[title="Flip horizontal"] > .PinturaButtonInner').click();
      cy.get('[title="Rotate left"] > .PinturaButtonInner').click();
      cy.get('[title="Rotate left"] > .PinturaButtonInner').click();
      cy.get(
        '[title="Flip vertical"] > .PinturaButtonInner > .PinturaButtonIcon',
      ).click();
      cy.get('[data-cy="edit-cover-image-save-button"]').click();
      cy.wait('@signedUpload');
      cy.wait('@uploadImage');
      cy.wait('@profileUpdate');
      cy.get('[data-cy="edit-avatar-image-editor-open-button"]').click({
        force: true,
      });
      cy.get('[data-cy="edit-avatar-image-editor"]').selectFile(
        '@profileImage',
      );
      cy.wait(5000);
      cy.get('[data-cy="change-profile-status-button"]').click();
      cy.get('[data-cy="change-status-open-to-work-button"]').click();
      cy.get('[data-cy="change-status-save-button"]').click();
      cy.wait('@profileUpdate');
      cy.get('[data-cy="edit-avatar-image-save-button"]').click({
        force: true,
      });
      cy.wait('@signedUpload');
      cy.wait('@uploadImage', { timeout: 15000 });
      cy.wait('@profileUpdate');
    }

    function testSocialLinksDesktop() {
      // cy.get('[data-cy="edit-profile-personal-info-button"]').click();
      cy.get(
        '.mr-\\[1\\.125rem\\] > :nth-child(2) > [data-cy="SocialLinks-list"]',
      ).click();
      cy.get('[data-cy="social-link-open-button"]').click();
      cy.get('[data-cy="platform-youtube-social-link-item"]').click();
      cy.get('[data-cy="display-social-link-text-field"]').clear();
      cy.get('[data-cy="display-social-link-text-field"]').type('YouTube');
      cy.get('[data-cy="url-social-link-text-field"]').clear();
      cy.get('[data-cy="url-social-link-text-field"]').type(
        'https://www.youtube.com/@Aladia-cl1ux',
      );
      cy.get('.pt-4 > [data-cy="default-switch"]').click();
      cy.get('[data-cy="save-social-link-button"]').click();
    }

    function testFollowDesktop() {
      cy.intercept({
        method: 'POST',
        url: `${Cypress.env('apiBaseUrl')}/followers/**`,
      }).as('followUser');
      cy.login(
        Cypress.env('TEST_USER_EMAIL_1'),
        Cypress.env('TEST_USER_PASSWORD_1'),
      );
      cy.visitDesktop('/');
      cy.get('[data-cy="all-search-text-field"]').click();
      cy.get('[data-cy="all-search-text-field"]').clear();
      cy.get('[data-cy="all-search-text-field"]').type('test ci-cd');
      cy.get('[data-cy="search-profiles-tab"]').click();
      cy.get('[data-cy="search-profile-view-all-button"]').click();
      cy.get('[data-cy="follow-suggestion-test-ci-cd-button"]').click({
        force: true,
      });
      cy.wait('@followUser');
      cy.login(
        Cypress.env('TEST_USER_EMAIL'),
        Cypress.env('TEST_USER_PASSWORD'),
      );
      cy.visitDesktop('/');

      cy.get('[data-cy="profile-side-bar-item"]').click();
      cy.get('[data-cy="profile-followers-button"]').click();
      cy.get('[data-cy="profile-test-1-scenario-name-button"]').should(
        'be.visible',
      );
    }
  });
});
